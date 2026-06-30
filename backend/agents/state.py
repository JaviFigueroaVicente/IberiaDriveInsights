from typing import Annotated, TypedDict, Any
from langgraph.graph.message import add_messages

class CarState(TypedDict):
    # Historial de mensajes
    messages: Annotated[list, add_messages]

    # Datos del coche que vienen del formulario del Frontend
    car_data: dict

    # Datos que el flujo irá calculando y rellenando
    imagenes_coche: list[str]
    dmgs_detectados: list[str]
    precio_base: int
    precio_final: int