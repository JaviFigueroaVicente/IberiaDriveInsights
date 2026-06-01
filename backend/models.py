from sqlalchemy import Boolean, ForeignKey, Integer, String, Column, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base, engine

# Car Model
class CarKaffle(Base):
    __tablename__ = "cars_kaffle"

    id = Column(Integer, primary_key=True, autoincrement=True)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    version = Column(String(100), nullable=False)
    months_old = Column(Integer, nullable=False)
    power = Column(Integer, nullable=False)
    sale_type = Column(String(20), nullable=False) 
    gear_type = Column(String(30), nullable=False)
    fuel_type = Column(String(30), nullable=False)
    kms = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    is_prediction = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rep_id = Column(Integer, ForeignKey("users.id"))

    rep = relationship("User", back_populates="cars_kaffle")

# Car Model Principal (Administración)
class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Mantener como Integers (IDs que apuntan a los maestros)
    make = Column(Integer, nullable=False)
    model = Column(Integer, nullable=False)
    version = Column(Integer, nullable=False)
    gear_type = Column(Integer, nullable=False)
    fuel_type = Column(Integer, nullable=False)
    
    registration = Column(Date, nullable=False)
    power = Column(Integer, nullable=False)
    kms = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    is_prediction = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rep_id = Column(Integer, ForeignKey("users.id"))
    
    # SOLUCIÓN: Especificar 'primaryjoin' de forma explícita para evitar la ausencia de FK físicas
    make_rel = relationship("Make", primaryjoin="Car.make == Make.id", foreign_keys=[make])
    model_rel = relationship("Model", primaryjoin="Car.model == Model.id", foreign_keys=[model])
    version_rel = relationship("Version", primaryjoin="Car.version == Version.id", foreign_keys=[version])
    gear_rel = relationship("GearType", primaryjoin="Car.gear_type == GearType.id", foreign_keys=[gear_type])
    fuel_rel = relationship("FuelType", primaryjoin="Car.fuel_type == FuelType.id", foreign_keys=[fuel_type])
    
    rep = relationship("User", back_populates="cars")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(50))
    surname = Column(String(50))
    role = Column(Integer, default="2") 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    cars_kaffle = relationship("CarKaffle", back_populates="rep")
    cars = relationship("Car", back_populates="rep")


class Make(Base):
    __tablename__ = "makes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    models = relationship("Model", back_populates="makes")

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    id_marca = Column(Integer, ForeignKey("makes.id"))

    makes = relationship("Make", back_populates="models")
    versions = relationship("Version", back_populates="models")

class Version(Base):
    __tablename__ = "versions"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    id_modelo = Column(Integer, ForeignKey("models.id"))

    models = relationship("Model", back_populates="versions")

class FuelType(Base):
    __tablename__ = "fuel_types"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GearType(Base):
    __tablename__ = "gear_types"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())