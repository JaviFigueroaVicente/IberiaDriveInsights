from sqlalchemy import Boolean, ForeignKey, Integer, String, Column, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base, engine

class CarRecord(Base):
    __tablename__ = "car_records"

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



# class User(Base):
#     __table__name = "users"
#     id = Column(Integer, primary_key=True, index=True, required=True)
#     email = Column(String, unique=True, index=True, required=True)
#     hashed_password = Column(String, required=True)
#     name = Column(String, required=True)
#     surname = Column(String)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     items = relationship("Item", back_populates="owner")

# class Item(Base):
#     __tablename__ = "items"
#     id = Column(Integer, primary_key=True, index=True, required=True)
#     title = Column(String, required=True)
#     description = Column(String, required=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))
#     owner = relationship("User", back_populates="items")