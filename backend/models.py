from sqlalchemy import Boolean, ForeignKey, Integer, String, Column, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .core.config import Base

class User(Base):
    __table__name = "users"
    id = Column(Integer, primary_key=True, index=True, required=True)
    email = Column(String, unique=True, index=True, required=True)
    hashed_password = Column(String, required=True)
    name = Column(String, required=True)
    surname = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("Item", back_populates="owner")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True, required=True)
    title = Column(String, required=True)
    description = Column(String, required=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="items")