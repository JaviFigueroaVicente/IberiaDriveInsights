from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
import models
from database import SessionLocal
from schemas import Car, CarResponse

router = APIRouter(
    prefix="/cars",
    tags=["cars"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/cars", response_model=CarResponse)
async def create_car(car: Car, db: db_dependency):
    new_car = models.Car(make=car.make, model=car.model, version=car.version, months_old=car.months_old, power=car.power, sale_type=car.sale_type, gear_type=car.gear_type, fuel_type=car.fuel_type, kms=car.kms, price=car.price)
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.get("/cars/{car_id}", response_model=CarResponse)
async def get_cars(car_id: int, db: db_dependency):
    result = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Car not found")
    return result
