from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, models, schemas

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=list[schemas.Event])
def list_events(db: Session = Depends(database.get_db)):
    return db.query(models.Event).all()
