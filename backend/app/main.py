from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import events, bets, users, auth
from .utils.seed import seed_events

app = FastAPI(title="Sistema de Apostas", description="API para gerenciamento de apostas esportivas", version="1.0.0")

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    import time
    for _ in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except Exception:
            time.sleep(2)

    seed_events()

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(bets.router)
app.include_router(users.router)
