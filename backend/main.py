from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Annotated
import models
import uvicorn
from database import engine
from api import cars, auth
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://www.localhost:5173",
    "https://iberia-drive-insights-n2w788svq.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_headers(
    access_token: Annotated[str | None, Header()] = None,
    user_role: Annotated[str | None, Header()] = None,
    ):
    if access_token != "access_token":
        raise HTTPException(status_code=401, detail="Not authorized")

    return {
        "access_token": access_token,
        "user_role": user_role,
    }

@app.get("/")
def root():
    # return JSONResponse(content={"message": "Hello World"}, headers={"set-cookie": "email={users.email}"})
    return {"message": "Hello World"}

@app.get("/users")
def users():
    response = JSONResponse(content={"message": "Hello World"})
    response.set_cookie(key="email", value = users.email, path="/users")
    return response

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(cars.router, prefix="/cars", tags=["cars"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)