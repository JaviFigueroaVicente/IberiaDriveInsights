from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
import uvicorn
from database import engine
from api import cars

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(cars.router)
# app.include_router(users.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)