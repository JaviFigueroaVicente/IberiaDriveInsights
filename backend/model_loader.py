import os
import io
import urllib.request
import joblib
from pathlib import Path

# Recuperamos las variables de entorno
URL_MODELO = os.getenv("URL_MODELO")
URL_TRANSFORMADORES = os.getenv("URL_TRANSFORMADORES")

def init_models():
    if not URL_MODELO or not URL_TRANSFORMADORES:
        raise ValueError("Las variables de entorno URL_MODELO o URL_TRANSFORMADORES no están configuradas.")

    # --- 1. CARGA DEL MODELO ---
    if URL_MODELO.startswith(("http://", "https://")):
        print(f"[PRODUCCIÓN] Descargando modelo desde red: {URL_MODELO}")
        with urllib.request.urlopen(URL_MODELO) as response:
            model = joblib.load(io.BytesIO(response.read()))
    else:
        print(f"[LOCAL] Cargando modelo desde archivo local: {URL_MODELO}")
        ruta_local_modelo = Path(URL_MODELO)
        model = joblib.load(ruta_local_modelo)

    # --- 2. CARGA DE LOS TRANSFORMADORES ---
    if URL_TRANSFORMADORES.startswith(("http://", "https://")):
        print(f"[PRODUCCIÓN] Descargando transformadores desde red: {URL_TRANSFORMADORES}")
        with urllib.request.urlopen(URL_TRANSFORMADORES) as response:
            transformadores = joblib.load(io.BytesIO(response.read()))
    else:
        print(f"[LOCAL] Cargando transformadores desde archivo local: {URL_TRANSFORMADORES}")
        ruta_local_trans = Path(URL_TRANSFORMADORES)
        transformadores = joblib.load(ruta_local_trans)

    return model, transformadores