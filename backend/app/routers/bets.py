from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from random import choice
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/bets", tags=["bets"])

@router.post("/", response_model=List[schemas.Bet])
def create_bets(
    bets_in: List[schemas.BetCreate] = Body(...),
    db: Session = Depends(database.get_db),
    user = Depends(auth.get_current_user)
):
    # calcula total das apostas e verifica saldo
    total_amount = sum(b.amount for b in bets_in)
    if user.balance < total_amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente para realizar apostas")
    # debita do saldo e atualiza usuário
    user.balance -= total_amount
    db.add(user)
    db.flush()
    created = []
    for bet_in in bets_in:
        event = db.query(models.Event).get(bet_in.event_id)
        if not event:
            raise HTTPException(status_code=404, detail=f"Evento {bet_in.event_id} não encontrado")
        status = choice(["vencida", "pendente", "perdida"])
        bet = models.Bet(amount=bet_in.amount, event_id=event.id, user_id=user.id, status=status)
        db.add(bet)
        db.flush()
        db.refresh(bet)
        created.append(bet)
    db.commit()
    return created

@router.get("/", response_model=List[schemas.Bet])
def list_bets(
    db: Session = Depends(database.get_db),
    user = Depends(auth.get_current_user)
):
    return db.query(models.Bet).filter(models.Bet.user_id == user.id).all()
