from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
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

class UserUpdate(BaseModel):
    email: EmailStr
    name: str
    surname: str
    password: str
    role: int

    class Config:
        from_attributes = True

class UserInDB(User):
    password: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class ProfileUpdate(BaseModel):
    name: str
    surname: str

    class Config:
        from_attributes = True

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
    make: int
    model: int
    version: int
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

class CarAdmin(BaseModel):
    id: int
    make: int
    model: int
    version: int
    registration: date
    power: int
    gear_type: int
    fuel_type: int
    kms: int
    price: int
    is_prediction: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Inyección automática de objetos usando las relaciones definidas en models.py
    make_info: MakeResponse = Field(..., alias="make_rel")
    model_info: ModelResponse = Field(..., alias="model_rel")
    version_info: VersionResponse = Field(..., alias="version_rel")
    gear_info: GearResponse = Field(..., alias="gear_rel")
    fuel_info: FuelResponse = Field(..., alias="fuel_rel")
    user: User = Field(..., alias="rep")

    class Config:
        from_attributes = True
        populate_by_name = True

class CarUpdate(BaseModel):
    make: int
    model: int
    version: int
    registration: date
    power: int
    gear_type: int
    fuel_type: int
    kms: int
    price: int

class UserResponseWithCars(BaseModel):
    id: int
    email: EmailStr
    name: str
    surname: str
    role: int
    cars: List[CarResponse] = []

    class Config:
        from_attributes = True


class MyPredictions(BaseModel):
    id: int
    make: int
    model: int
    version: int
    registration: date
    power: int
    gear_type: int
    fuel_type: int
    kms: int
    price: int
    
    # Inyección automática de objetos usando las relaciones definidas en models.py
    make_info: MakeResponse = Field(..., alias="make_rel")
    model_info: ModelResponse = Field(..., alias="model_rel")
    version_info: VersionResponse = Field(..., alias="version_rel")
    gear_info: GearResponse = Field(..., alias="gear_rel")
    fuel_info: FuelResponse = Field(..., alias="fuel_rel")

    class Config:
        from_attributes = True
        populate_by_name = True

class UserResponse(BaseModel):
    id: int
    name: str
    surname: str
    email: EmailStr
    role: int
    created_at: datetime
    cars: List[CarResponse] = []

    class Config:
        from_attributes = True

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str