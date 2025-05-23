from fastapi import FastAPI
from .database import engine, Base
app = FastAPI(title="Sistema de Apostas", description="API para gerenciamento de apostas esportivas", version="1.0.0")

@app.on_event("startup")
def on_startup():
    import time
    for _ in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except Exception:
            time.sleep(2)
