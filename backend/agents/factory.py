import os
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_ollama import ChatOllama

def obtener_modelo() -> BaseChatModel:
    """
    Detecta de forma automática el entorno actual.
    Devuelve Ollama (local) o Groq (producción) configurados para visión.
    """

    entorno = os.getenv("ENV", "development").lower()

    if entorno == "production":
        from langchain_groq import ChatGroq
        print("[INFRAESTRUCTURA] Iniciando Llama 3.2 Vision en Groq Cloud...")
        return ChatGroq(
            model="llama-3.2-11b-vision-preview", 
            temperature=0.0
        )
    else:
        print("[INFRAESTRUCTURA] Iniciando Llava en Ollama Local...")
        return ChatOllama(
            model="qwen.3.5:4b", 
            temperature=0.0
        )