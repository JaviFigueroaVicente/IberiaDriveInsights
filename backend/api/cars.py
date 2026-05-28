from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List
import models
from database import SessionLocal
from schemas import CarBase, CarResponse, MakeResponse, ModelResponse, VersionResponse, CarPrediction, PredictionResponse, FuelResponse, GearResponse
from api.auth import get_current_user, get_admin_user
import joblib
import pandas as pd
from datetime import datetime
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/make", response_model=List[MakeResponse])
async def get_makes(db: db_dependency):
    result = db.query(models.Make).all()
    return result

@router.get("/make/{make_id}/models", response_model=List[ModelResponse])
async def get_models(make_id: int, db: db_dependency):
    result = db.query(models.Model).filter(models.Model.id_marca == make_id).all()
    return result

@router.get("/model/{model_id}/versions", response_model=List[VersionResponse])
async def get_versions(model_id: int, db: db_dependency):
    result = db.query(models.Version).filter(models.Version.id_modelo == model_id).all()
    return result

@router.get("/fuel", response_model=List[FuelResponse])
async def get_fuels(db: db_dependency):
    result = db.query(models.FuelType).all()
    return result

@router.get("/gear", response_model=List[GearResponse])
async def get_gears(db: db_dependency):
    result = db.query(models.GearType).all()
    return result

@router.post("/", response_model=CarResponse)
async def create_car(car: CarBase, db: db_dependency, current_user: Annotated[models.User, Depends(get_current_user)]):
    new_car = models.Car(**car.model_dump(), rep_id=current_user.id)
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.get("/", response_model=List[CarBase])
async def get_cars(db: db_dependency):
    result = db.query(models.Car).all()
    return result

@router.get("/{car_id}", response_model=CarResponse)
async def get_cars(car_id: int, db: db_dependency):
    result = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Car not found")
    return result

@router.delete("/{id}")
async def delete_car(id: int, admin: Annotated[models.User, Depends(get_admin_user)]):
    return {"message": "Coche borrado"}


DIR_API = os.path.dirname(os.path.abspath(__file__))
DIR_BACKEND = os.path.dirname(DIR_API)

PATH_MODELO = os.path.join(DIR_BACKEND, "ai_models", "compra_coches", "modelo_compra_coches_iberia.pkl")
PATH_TRANSFORMADORES = os.path.join(DIR_BACKEND, "ai_models", "compra_coches", "transformadores.pkl")

try:
    model = joblib.load(PATH_MODELO)
    transformadores = joblib.load(PATH_TRANSFORMADORES)
except Exception as e:
    print(f"Error al cargar archivos: {e}")
    model = None
    transformadores = None

@router.post("/predict", response_model=CarResponse)
async def predict_car(car: CarPrediction, db: db_dependency, current_user: Annotated[models.User, Depends(get_current_user)]):
    if not model:
        raise HTTPException(status_code=404, detail="Modelo no encontrado")
    if not transformadores:
        raise HTTPException(status_code=404, detail="Transformadores no encontrados")
    
    try:
        fecha = pd.to_datetime(car.registration)
        hoy = datetime.now()
        antiguedad = (hoy.year - fecha.year) * 12 + (hoy.month - fecha.month)
        if antiguedad < 0:
            antiguedad = 0
        
        input_dict = {
            'make': car.make,
            'model': car.model,
            'version': car.version,
            'gear_type': car.gear_type,
            'fuel_type': car.fuel_type,
            'power': car.power,
            'kms': car.kms,
            'antiguedad_meses': antiguedad
        }

        columnas_modelo = transformadores['features_names']
        df_predict = pd.DataFrame([input_dict])[columnas_modelo].astype('int64')

        precio = int(model.predict(df_predict)[0])

        car_bbdd = car.model_dump()

        car_bbdd['price'] = precio
        car_bbdd['is_prediction'] = True

        new_car = models.Car(**car_bbdd, rep_id=current_user.id)

        db.add(new_car)
        db.commit()
        db.refresh(new_car)

        return new_car

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")