import os
import traceback
from redis import Redis
from rq import SimpleWorker, Queue
from database import SessionLocal
import models
from dotenv import load_dotenv

load_dotenv()

from agents.graph import agent
# Importamos la función que descarga/carga los modelos .pkl
from model_loader import init_models 

# Cargar en memoria global del Worker al iniciar el proceso
print("[WORKER] Cargando modelos ML en memoria...")
model_ml, transformadores_ml = init_models()


def procesar_grafo_coche(car_id: int, car_data: dict, lista_img: list):
    """
    Función que ejecuta el Worker en segundo plano.
    Recibe exactamente los 3 argumentos encolados desde FastAPI.
    """
    print(f"\n[WORKER] ⚙️ Iniciando peritaje asíncrono para Coche ID: {car_id}")
    db = SessionLocal()

    coche = db.query(models.Car).filter(models.Car.id == car_id).first()
    if coche:
        coche.status = "tasando"
        db.commit()

    inputs = {
        "messages": [{"role": "user", "content": "Iniciar tasación con peritaje visual."}],
        "car_data": car_data,
        "car_id": car_id,
        "imagenes_coche": lista_img,
        "damages": [],
        "precio_base": 0,
        "precio_final": 0,
        "status": "tasando"
    }

    try:
        config = {
            "recursion_limit": 10,
            "configurable": {
                "model": model_ml,
                "transformadores": transformadores_ml,
                "db": db
            }
        }

        # Ejecutar el grafo de LangGraph
        resultado = agent.invoke(inputs, config=config)

        # Actualizar el registro en PostgreSQL
        coche = db.query(models.Car).filter(models.Car.id == car_id).first()
        if coche:
            coche.price = resultado.get("precio_final", 0)
            coche.price_base = resultado.get("precio_base", 0)
            coche.status = resultado.get("status", "tasado")
            coche.damages = resultado.get("damages", [])
            coche.diagnostico_dmgs = resultado.get("diagnostico_dmgs", "desconocido")

            db.commit()
            print(f"[WORKER] ✅ Coche {car_id} actualizado con éxito en BBDD. Estado: {coche.status}")

    except Exception as e:
        db.rollback()
        coche_error = db.query(models.Car).filter(models.Car.id == car_id).first()
        if coche_error:
            coche_error.status = "error"
            db.commit()
        print(f"[WORKER ERROR] Error al procesar coche {car_id}: {str(e)}")
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    redis_url = os.getenv("REDIS_URL")
    
    print(f"[WORKER] Conectando a Redis...")
    
    # 2. Conectar a Redis usando la URL dinámica
    redis_conn = Redis.from_url(redis_url)
    print("[WORKER] Escuchando cola de peritajes en segundo plano...")
    # Forma compatible con las versiones actuales de RQ:
    worker = SimpleWorker([Queue("peritajes", connection=redis_conn)], connection=redis_conn)
    worker.work()