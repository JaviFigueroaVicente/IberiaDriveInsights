from sqlalchemy import Boolean, ForeignKey, Integer, String, Column, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base, engine

class Car(Base):
    __tablename__ = "cars"

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
    
    cars = relationship("Car", back_populates="rep")