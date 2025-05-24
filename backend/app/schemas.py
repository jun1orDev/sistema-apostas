from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

class UserRead(BaseModel):
		id: int
		email: EmailStr
		balance: float
		class Config:
				from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Event(BaseModel):
    id: int
    name: str
    date_initial: datetime
    odd_home: float
    odd_draw: float
    odd_away: float
    class Config:
        from_attributes = True

class BetCreate(BaseModel):
    event_id: int
    amount: float

class Bet(BaseModel):
    id: int
    event: Event
    amount: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True
