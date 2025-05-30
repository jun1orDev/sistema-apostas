from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    bets = relationship("Bet", back_populates="user")
    balance = Column(Float, default=0.0)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    date_initial = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    odd_home = Column(Float, nullable=False)
    odd_draw = Column(Float, nullable=False)
    odd_away = Column(Float, nullable=False)

class Bet(Base):
    __tablename__ = "bets"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    selected_option = Column(String(20), nullable=False)
    profit = Column(Float, default=0.0, nullable=False)

    event = relationship("Event")
    user = relationship("User", back_populates="bets")
