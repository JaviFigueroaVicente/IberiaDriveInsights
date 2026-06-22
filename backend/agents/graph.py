import json
from langgraph.graph import StateGraph, START, END
from agents.state import CarState
from agents.factory import obtener_modelo
from langchain_core.messages import HumanMessage

# Nodo de peritación
def peritacion(state: CarState):
    img_b64 = state.imagen_coche

    if not img_b64:
        return {"dmgs_detectados": []}
    
    # Llamamos al modelo
    ai_model = obtener_modelo()

    prompt = """
    Analiza la carrocería de este coche. Identifica daños visibles (bollos, roces, arañazos).
    Debes clasificar los daños únicamente usando estas etiquetas válidas del sector técnico:
    - 'pintura_panio' (si hay roces o abolladuras en chapas/paragolpes)
    - 'neumatico_unidad' (si se ve un neumático pinchado o destrozado)
    
    Devuelve estrictamente un JSON limpio con el formato: {"dmgs": ["etiqueta1", "etiqueta2"]}
    Si el coche está perfecto, devuelve: {"dmgs": []}
    No escribas introducciones ni explicaciones, solo el objeto JSON.
    """

    mensaje = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}
        ]
    )

    respuesta = ai_model.invoke([mensaje])

    try:
        # Limpiamos posibles caracteres extraños del markdown que a veces añaden los LLM
        clean_content = respuesta.content.strip().replace("```json", "").replace("```", "")
        data = json.loads(clean_content)
        dmgs = data.get("dmgs", [])
    except Exception as e:
        print(f"Error al parsear JSON del peritaje: {e}. Respuesta cruda: {respuesta.content}")
        dmgs = []

    return {"dmgs_detectados": dmgs}

# Nodo de cálculo de precio post peritación
def calcular_precio(state: CarState):
    from api.cars import predict_car

    # Ejecución de la predicción base
    car = state.car_data
    precio_base = predict_car(car)

    # Precios de daños detectados
    TABLA_COSTES = {
        "pintura_panio": 180.00,
        "neumatico_unidad": 95.00
    }

    total_dmgs = 0
    for dmg in state.dmgs_detectados:
        total_dmgs += TABLA_COSTES.get(dmg, 0)

    precio_final = precio_base - total_dmgs

    # Evitamos valores negativos o sin sentido fijando el valor residual mínimo del 10% (según BOE)
    if precio_final < (precio_base * 0.1):
        precio_final = precio_base * 0.1
        
    return {
        "precio_base": int(precio_base),
        "precio_final": int(precio_final)
    }

# Fulo de LangGraph
workflow = StateGraph(CarState)

workflow.add_node("peritacion", peritacion)
workflow.add_node("calcular_precio", calcular_precio)

workflow.add_edge(START, "peritacion")
workflow.add_edge("peritacion", "calcular_precio")
workflow.add_edge("calcular_precio", END)

agent = workflow.compile()