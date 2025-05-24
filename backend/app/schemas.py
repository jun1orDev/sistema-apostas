from pydantic import BaseModel, EmailStr
from typing import List

class UserRead(BaseModel):
		id: int
		email: EmailStr
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
    odds: float
    class Config:
        from_attributes = True

class BetCreate(BaseModel):
    event_id: int
    amount: float
    status: str

class Bet(BaseModel):
    id: int
    event: Event
    amount: float
    status: str
    class Config:
        from_attributes = True
