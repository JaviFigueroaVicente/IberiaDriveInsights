import os
import io
import urllib.request
import joblib
from functools import lru_cache
import dotenv

dotenv.load_dotenv()

URL_MODELO = os.getenv("URL_MODELO")
URL_TRANSFORMADORES = os.getenv("URL_TRANSFORMADORES")

def init_models():
    with urllib.request.urlopen(os.getenv("URL_MODELO")) as response:
        model = joblib.load(io.BytesIO(response.read()))
    with urllib.request.urlopen(os.getenv("URL_TRANSFORMADORES")) as response:
        transformadores = joblib.load(io.BytesIO(response.read()))
    return model, transformadores