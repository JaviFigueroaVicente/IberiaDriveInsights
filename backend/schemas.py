from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from datetime import date

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr | None = None

# Users
class User(BaseModel):
    id: int
    email: EmailStr
    name: str
    surname: str
    role: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    surname: str

class UserInDB(User):
    password: str
    created_at: datetime
    updted_at: Optional[datetime] = None

# Cars
class CarBase(BaseModel):
    id: int
    make: str
    model: str
    version: str
    registration: date
    power: int
    gear_type: str
    fuel_type: str
    kms: int
    price: int
    is_prediction: bool
    created_at: datetime
    updated_at: Optional[datetime]

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

class CarPrediction(BaseModel):
    make: str
    model: str
    version: str
    registration: date
    power: int
    gear_type: str
    fuel_type: str
    kms: int

class PredictionResponse(BaseModel):
    price: int


# Makes
class MakeResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# Models
class ModelResponse(BaseModel):
    id: int
    nombre: str
    id_marca: int

    class Config:
        from_attributes = True

# Versions
class VersionResponse(BaseModel):
    id: int
    nombre: str
    id_modelo: int

    class Config:
        from_attributes = True

# Fuel Types
class FuelResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# Gear Types
class GearResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True