from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    email: EmailStr
    name: str
    surname: str
    password: str
    created_at: datetime
    updated_at: datetime

class CarRecord(BaseModel):
    id: int
    make: str
    model: str
    version: str
    months_old: int
    power: int
    sale_type: str
    gear_type: str
    fuel_type: str
    kms: int
    price: int

class CarRecordCreate(CarRecord):
    is_prediction: bool = True
    

class CarRecordResponse(BaseModel):
    id: int
    make: str
    model: str
    price: int
    class Config:
        from_attributes = True
