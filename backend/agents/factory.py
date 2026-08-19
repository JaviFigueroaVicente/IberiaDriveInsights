import os
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq

def obtener_modelo() -> BaseChatModel:
    """
    Detecta de forma automática el entorno actual.
    Devuelve Ollama (local) o Groq (producción) configurados para visión.
    """

    entorno = os.getenv("ENV", "development").lower()

    if entorno == "production":
        print("[INFRAESTRUCTURA] Iniciando Llama 3.2 Vision en Groq Cloud...")
        return ChatGroq(
            model="qwen/qwen3.6-27b",
            temperature=0.0,
            timeout=1200
        )
    else:
        print("[INFRAESTRUCTURA] Iniciando Qwen en Ollama Local...")
        return ChatOllama(
            model="qwen3.5:4b", 
            temperature=0.0,
            timeout=1200
        )