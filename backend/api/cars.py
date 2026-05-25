from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List
import models
from database import SessionLocal
from schemas import CarBase, CarResponse, MakeResponse, ModelResponse, VersionResponse
from api.auth import get_current_user, get_admin_user

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



import pandas as pd
import joblib
from datetime import datetime
import requests

# # Cargar el cerebro del proyecto
# modelo = joblib.load('../ai_models/compra_coches/modelo_compra_coches_iberia.pkl')
# procesadores = joblib.load('../ai_models/compra_coches/transformadores.pkl')

# def preparar_datos(datos):
#     """Convierte el JSON de la web al formato que entiende el modelo"""
#     df = pd.DataFrame([datos])
    
#     # 1. Recrear columnas combinadas (igual que en el entrenamiento)
#     df['model_unique'] = df['make'] + "_" + df['model']
#     df['version_unique'] = df['model_unique'] + "_" + df['version']
    
#     # 2. Transformar categorías a números (usando .transform, NO fit)
#     df['make_num'] = procesadores['le_make'].transform(df['make'])
#     df['model_num'] = procesadores['le_model'].transform(df['model_unique'])
#     df['version_num'] = procesadores['le_version'].transform(df['version_unique'])
    
#     # 3. Aplicar OneHotEncoder (cambio y combustible)
#     encoded_cols = procesadores['oe'].transform(df[['gear_type', 'fuel_type']])
#     df_encoded = pd.DataFrame(encoded_cols, columns=procesadores['oe'].get_feature_names_out())
    
#     # 4. Calcular antigüedad en meses
#     fecha_reg = pd.to_datetime(datos['registration'])
#     hoy = datetime.now()
#     df['antiguedad_meses'] = (hoy.year - fecha_reg.year) * 12 + (hoy.month - fecha_reg.month)
    
#     # 5. Unir y ordenar columnas EXACTAMENTE como el modelo espera
#     # Seleccionamos las columnas numéricas originales + las del OneHot
#     df_final = pd.concat([df[['kms', 'power', 'make_num', 'model_num', 'version_num', 'antiguedad_meses']], df_encoded], axis=1)
    
#     # Reordenar según la lista guardada en el entrenamiento
#     df_final = df_final[procesadores['features_names']]
    
#     return df_final

# @router.post('/predecir')
# async def predict():
#         # Recibir datos del formulario web
#         datos_usuario = requests.json 
#         # Ejemplo esperado: {"make": "Kia", "model": "cee'd", "version": "1.6 CRDi", ...}
        
#         input_modelo = preparar_datos(datos_usuario)
        
#         # Realizar predicción
#         prediccion = modelo.predict(input_modelo)[0]
        
#         return prediccion
