from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class CarState(TypedDict):
    # Historial de mensajes
    messages: Annotated[list, add_messages]

    # Datos del coche que vienen del formulario del Frontend
    car_data: dict

    # Datos que el flujo irá calculando y rellenando
    imagen_coche: str
    danos_detectados: list[str]
    precio_base: int
    precio_final: int