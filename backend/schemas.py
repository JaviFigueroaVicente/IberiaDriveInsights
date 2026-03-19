from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr | None = None

# Users
class User(BaseModel):
    email: EmailStr
    name: str
    surname: str

class UserInDB(User):
    password: str
    created_at: datetime
    updated_at: datetime

# Cars
class CarBase(BaseModel):
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

    class Config:
        from_attributes = True

class CarCreate(CarBase):
    is_prediction: bool = True
    

class CarResponse(BaseModel):
    id: int
    make: str
    model: str
    price: int

    class Config:
        from_attributes = True