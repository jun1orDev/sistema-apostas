# backend/app/utils/seed.py
import os
import time
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.database import SessionLocal, engine, Base
from app.models import Event

load_dotenv()

def seed_events():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    eventos = [
        {"name": "Barcelona vs Real Madrid", "odds": 1.75},
        {"name": "Brasil vs Argentina",     "odds": 2.10},
        {"name": "Lakers vs Warriors",      "odds": 1.90},
        {"name": "Fórmula 1: GP de Mônaco",  "odds": 3.20},
        {"name": "Super Bowl LVII",         "odds": 2.50},
				{"name": "UFC 285: Jones vs Gane",  "odds": 1.80},
				{"name": "Wimbledon Finals",        "odds": 2.00},
				{"name": "NBA Finals Game 7",      "odds": 1.60},
				{"name": "World Series Game 5",    "odds": 2.30},
				{"name": "Champions League Final",  "odds": 1.90},
    ]
    inserted = 0
    for ev in eventos:
        if not db.query(Event).filter(Event.name == ev["name"]).first():
            db.add(Event(name=ev["name"], odds=ev["odds"]))
            inserted += 1
    db.commit()
    db.close()
    print(f"{inserted} novos eventos inseridos.")
