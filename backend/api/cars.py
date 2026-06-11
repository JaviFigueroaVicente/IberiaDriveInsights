from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Annotated, List
import models
from database import SessionLocal
from schemas import CarBase, CarResponse, MakeResponse, ModelResponse, VersionResponse, CarPrediction, CarUpdate, FuelResponse, GearResponse, CarAdmin, MyPredictions
from api.auth import get_current_user, get_admin_user
import joblib
import pandas as pd
from datetime import datetime
import os
import io
import urllib.request

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
    makes_data = db.query(models.Make).all()
    return makes_data

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


# Funciones de perfil
@router.get("/my-cars", response_model=List[MyPredictions])
async def get_my_cars(db: db_dependency, current_user: Annotated[models.User, Depends(get_current_user)]):
    cars_data = db.query(models.Car).filter(
        models.Car.rep_id == current_user.id
    ).options(
        joinedload(models.Car.make_rel),
        joinedload(models.Car.model_rel),
        joinedload(models.Car.version_rel),
        joinedload(models.Car.gear_rel),
        joinedload(models.Car.fuel_rel)
    ).order_by(models.Car.created_at.desc()).all()
    
    return cars_data


@router.get("/{car_id}", response_model=CarResponse)
async def get_cars(car_id: int, db: db_dependency):
    makes_data = db.query(models.Make).all()
    make_dict = {m.nombre: m.nombre for m in makes_data}

    models_data = db.query(models.Model).all()
    model_dict = {m.nombre: m.nombre for m in models_data}

    versions_data = db.query(models.Version).all()
    version_dict = {v.nombre: v.nombre for v in versions_data}

    # Obtener el coche
    car = db.query(models.Car).filter(models.Car.id == car_id).first()

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    return {
        **car.model_dump(),
        "make": make_dict.get(car.make, car.make) if car.make else car.make,
        "model": model_dict.get(car.model, car.model) if car.model else car.model,
        "version": version_dict.get(car.version, car.version) if car.version else car.version
    }


# Funciones de administrador 
@router.post("/", response_model=CarResponse)
async def create_car(car: CarBase, db: db_dependency, current_user: Annotated[models.User, Depends(get_admin_user)]):
    new_car = models.Car(**car.model_dump(), rep_id=current_user.id)
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.get("/", response_model=List[CarAdmin])
async def get_cars(db: db_dependency, current_user: Annotated[models.User, Depends(get_admin_user)]):
    cars_data = db.query(models.Car).options(
        joinedload(models.Car.make_rel),
        joinedload(models.Car.model_rel),
        joinedload(models.Car.version_rel),
        joinedload(models.Car.gear_rel),
        joinedload(models.Car.fuel_rel),
        joinedload(models.Car.rep)
    ).all()
    return cars_data

@router.put("/{car_id}", response_model=CarResponse)
async def update_car(
    car_id: int, 
    car_data: CarUpdate,
    db: db_dependency, 
    current_user: Annotated[models.User, Depends(get_admin_user)]
):
    # Buscar el coche existente en la base de datos
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    
    # Actualizar los campos con los nuevos datos recibidos
    update_dict = car_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_car, key, value)
        
    # Si en la actualización también permites modificar el precio de forma manual:
    if hasattr(car_data, 'price'):
        db_car.price = car_data.price

    db_car.updated_at = datetime.now()

    db.commit()
    db.refresh(db_car)
    return db_car


@router.delete("/{car_id}", status_code=200)
async def delete_car(
    car_id: int, 
    db: db_dependency, 
    current_user: Annotated[models.User, Depends(get_admin_user)]
):
    # Buscar el coche existente en la base de datos
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    
    # Eliminar el registro
    db.delete(db_car)
    db.commit()
    
    return {"detail": f"Vehículo con ID {car_id} eliminado correctamente"}

# Cargar el modelo y los transformadores en local
# DIR_API = os.path.dirname(os.path.abspath(__file__))
# DIR_BACKEND = os.path.dirname(DIR_API)

# PATH_MODELO = os.path.join(DIR_BACKEND, "ai_models", "compra_coches", "modelo_compra_coches_iberia.pkl")
# PATH_TRANSFORMADORES = os.path.join(DIR_BACKEND, "ai_models", "compra_coches", "transformadores.pkl")

# try:
#     model = joblib.load(PATH_MODELO)
#     transformadores = joblib.load(PATH_TRANSFORMADORES)
# except Exception as e:
#     print(f"Error al cargar archivos: {e}")
#     model = None
#     transformadores = None

# Cargar el moedlo y los transformadores en Supabase
URL_MODELO = os.environ.get("URL_MODELO")
URL_TRANSFORMADORES = os.environ.get("URL_TRANSFORMADORES")

def cargar_recursos():
    if not URL_MODELO or not URL_TRANSFORMADORES:
        print("Error: Las variables de entorno URL_MODELO o URL_TRANSFORMADORES no están definidas.")
        return None, None

    try:
        print(f"Descargando de: {URL_MODELO}")
        with urllib.request.urlopen(URL_MODELO) as response:
            model = joblib.load(io.BytesIO(response.read()))
            
        print(f"Descargando de: {URL_TRANSFORMADORES}")
        with urllib.request.urlopen(URL_TRANSFORMADORES) as response:
            transformadores = joblib.load(io.BytesIO(response.read()))
            
        return model, transformadores
    except Exception as e:
        print(f"Error crítico al cargar los archivos: {e}")
        return None, None

model, transformadores = cargar_recursos()

# Función de predicción
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