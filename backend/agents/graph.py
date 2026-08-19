import json
from langgraph.graph import StateGraph, START, END
from agents.state import CarState
from agents.factory import obtener_modelo
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableConfig
from sqlalchemy import text
import models
import base64
from io import BytesIO
from PIL import Image

def optimizar_imagen_b64(b64_string: str, max_size=(800, 800)) -> str:
    """Reduce la resolución y el tamaño en bytes de la imagen Base64."""
    try:
        img_data = base64.b64decode(b64_string)
        img = Image.open(BytesIO(img_data))
        
        # Convertir a RGB si está en RGBA
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=75)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        print(f"Error optimizando imagen: {e}")
        return b64_string

    
# Nodo de peritación
def peritacion(state: CarState, config: RunnableConfig):
    configurable = config.get("configurable", {})
    db = configurable.get("db", None)
    car_id = state.get("car_id")

    # 1. ACTUALIZAR ESTADO A "peritando" ANTES DE LA INFERENCIA
    if db and car_id:
        coche = db.query(models.Car).filter(models.Car.id == car_id).first()
        if coche:
            coche.status = "peritando"
            db.commit()

    img_b64 = state.get("imagenes_coche", [])

    if not img_b64:
        return {"damages": [], "status": "peritado"}

    # Llamamos al modelo
    ai_model = obtener_modelo()

    prompt = """
    Objetivo: Analizar las imágenes del coche y detectar todos los daños visibles de la carrocería.
    
    Reglas estrictas:
    1. Analiza todas las fotos en conjunto.
    2. Si un daño se repite (ej. 2 faros rotos o 2 llantas rascadas), REPITE la etiqueta en el array por cada unidad dañada.
    3. Devuelve ÚNICAMENTE el objeto JSON crudo, sin markdown (```json), sin introducciones ni explicaciones.

    Catálogo técnico:
    'pintura_leve' (roces/arañazos)
    'pintura_con_chapa' (bollos/deformaciones leves)
    'optica_delantera' (faro delantero roto/agrietado)
    'optica_trasera' (piloto trasero roto/agrietado)
    'retrovisor_completo' (espejo roto/colgando)
    'luna_parabrisas' (parabrisas agrietado/picado)
    'luna_trasera' (cristal trasero roto)
    'ventanilla_lateral' (ventanilla rota)
    'neumatico_unidad' (rueda pinchada/destrozada)
    'llanta_daño_grave' (llanta abollada/muy rascada)
    'capo_deformado' (capó abollado/levantado)
    'puerta_hundida' (puerta con golpe profundo)
    'techo_hundido' (techo abollado grave)
    'golpe_estructural_frontal' (frontal destrozado/airbags saltados)
    'golpe_estructural_trasero' (maletero hundido fuerte)
    'golpe_estructural_lateral' (lateral empotrado)

    Formato de salida esperado:
    {"damages": ["optica_delantera", "optica_delantera", "pintura_leve"]}

    Si no hay daños:
    {"damages": []}
    """

    contenido_mensaje = [{"type": "text", "text": prompt}]

    for img in img_b64:
        img_opt = optimizar_imagen_b64(img)
        contenido_mensaje.append({
            "type": "image_url", 
            "image_url": {"url": f"data:image/jpeg;base64,{img_opt}"}
        })

    mensaje = HumanMessage(content=contenido_mensaje)
    respuesta = ai_model.invoke([mensaje])

    lista_ids = []
    try:
        clean_content = respuesta.content.strip().replace("```json", "").replace("```", "")
        data = json.loads(clean_content)
        tags_detectados = data.get("damages", [])

        if tags_detectados and db:
            # Una sola consulta masiva eliminando duplicados temporales para el IN de SQL
            tags_unicos = list(set(tags_detectados))
            query = text("SELECT id, damage_type FROM damages WHERE damage_type = ANY(:tags)")
            rows = db.execute(query, {"tags": tags_unicos}).fetchall()
            
            mapa_maestro = {row[1]: row[0] for row in rows}

            # Construimos la lista final respetando las repeticiones que envió el LLM
            for tag in tags_detectados:
                if tag in mapa_maestro:
                    lista_ids.append(mapa_maestro[tag])

    except Exception as e:
        print(f"Error al parsear JSON del peritaje: {e}. Respuesta cruda: {respuesta.content}")
        lista_ids = []

    return {
        "damages": lista_ids,
        "status": "peritado"
    }

# Nodo de cálculo de precio post peritación
def calcular_precio(state: CarState, config: RunnableConfig):
    from api.cars import obtener_prediccion_precio

    configurable = config.get("configurable", {})
    model = configurable.get("model")
    transformadores = configurable.get("transformadores")
    db = configurable.get("db", None)
    car_id = state.get("car_id")

    if db and car_id:
        coche = db.query(models.Car).filter(models.Car.id == car_id).first()
        if coche:
            coche.status = "calculando_precio"
            db.commit()

    # Ejecución de la predicción base
    car = state.get("car_data", {})
    precio_base = obtener_prediccion_precio(car, model, transformadores)

    ids = state.get("damages", [])
    total_porcentaje = 0.0

    if ids and db:
        # Consulta masiva limpia
        query = text("SELECT id, penalty_percentage FROM damages WHERE id = ANY(:ids)")
        rows = db.execute(query, {"ids": list(set(ids))}).fetchall()
        mapa_porcentajes = {row[0]: float(row[1]) for row in rows}
        
        # Sumamos acumulando si el ID se repite
        for damage_id in ids:
            total_porcentaje += mapa_porcentajes.get(damage_id, 0.0)

    if 14 in ids and 11 in ids:
        total_porcentaje += 25.0

    UMBRAL_SINIESTRO = 70.0
    if total_porcentaje >= UMBRAL_SINIESTRO:
        return {"precio_base": int(precio_base), "precio_final": 0, "total_porcentaje": total_porcentaje, "diagnostico_dmgs": "siniestro", "status": "tasado"}
    
    if total_porcentaje == 0:
        return {"precio_base": int(precio_base), "precio_final": int(precio_base), "total_porcentaje": 0.0, "diagnostico_dmgs": "perfecto", "status": "tasado"}
    

    descuento = precio_base * (total_porcentaje / 100.0)
    precio_final = precio_base - descuento
    
    if precio_final < (precio_base * 0.1):
        precio_final = precio_base * 0.1

    diagnostico_dmgs = "daño grave" if (total_porcentaje > 30.0 or precio_final == precio_base * 0.1) else "daño leve"
        
    return {
        "precio_base": int(precio_base),
        "precio_final": int(precio_final),
        "total_porcentaje": total_porcentaje,        
        "status": "tasado",
        "diagnostico_dmgs": diagnostico_dmgs
    }
# Fulo de LangGraph
workflow = StateGraph(CarState)

workflow.add_node("peritacion", peritacion)
workflow.add_node("calcular_precio", calcular_precio)

workflow.add_edge(START, "peritacion")
workflow.add_edge("peritacion", "calcular_precio")
workflow.add_edge("calcular_precio", END)

agent = workflow.compile()