from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, database, auth
import random

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # verifica se já existe
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed = auth.get_password_hash(user_in.password)
    initial_balance = round(random.uniform(10.0, 500.0), 2)
    user = models.User(email=user_in.email, hashed_password=hashed, balance=initial_balance)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
