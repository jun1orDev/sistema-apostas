from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas, auth

router = APIRouter(prefix="/bets", tags=["bets"])

@router.post("/", response_model=schemas.Bet)
def create_bet(
    bet_in: schemas.BetCreate,
    db: Session = Depends(database.get_db),
    user = Depends(auth.get_current_user)
):
    event = db.query(models.Event).get(bet_in.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    bet = models.Bet(amount=bet_in.amount, event_id=event.id, user_id=user.id)
    db.add(bet)
    db.commit()
    db.refresh(bet)
    return bet

@router.get("/", response_model=list[schemas.Bet])
def list_bets(
    db: Session = Depends(database.get_db),
    user = Depends(auth.get_current_user)
):
    return db.query(models.Bet).filter(models.Bet.user_id == user.id).all()
