# backend/app/utils/seed.py
import os
import time
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import datetime
import random

from app.database import SessionLocal, engine, Base
from app.models import Event

load_dotenv()

def seed_events():
	Base.metadata.create_all(bind=engine)

	db: Session = SessionLocal()
	# nomes de eventos sem odds fixas
	nomes = [
		"Flamengo vs Palmeiras",
		"Corinthians vs São Paulo",
		"Grêmio vs Internacional",
		"Atlético Mineiro vs Cruzeiro",
		"Vasco vs Botafogo",
		"Santos vs Fluminense",
		"Bahia vs Fortaleza",
		"Athletico Paranaense vs Goiás",
		"Ceará vs América Mineiro",
		"Bragantino vs Cuiabá",
	]
	inserted = 0
	for name in nomes:
		if not db.query(Event).filter(Event.name == name).first():
			# gera odds aleatórias
			odd_home = round(random.uniform(1.5, 3.0), 2)
			odd_draw = round(random.uniform(2.0, 4.0), 2)
			odd_away = round(random.uniform(1.5, 3.0), 2)
			# data e hora futura random (1 a 7 dias, 0 a 23 horas, 0 a 59 minutos)
			future_date = datetime.datetime.utcnow() + datetime.timedelta(
				days=random.randint(1, 7),
				hours=random.randint(0, 23),
				minutes=random.randint(0, 59)
			)
			db.add(Event(
				name=name,
				date_initial=future_date,
				odd_home=odd_home,
				odd_draw=odd_draw,
				odd_away=odd_away
			))
			inserted += 1
	db.commit()
	db.close()
	print(f"{inserted} novos eventos inseridos.")
