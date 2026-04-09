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

@router.get("/{car_id}", response_model=CarResponse)
async def get_cars(car_id: int, db: db_dependency):
    result = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Car not found")
    return result

@router.delete("/{id}")
async def delete_car(
    id: int, 
    admin: Annotated[models.User, Depends(get_admin_user)]
):
    return {"message": "Coche borrado"}