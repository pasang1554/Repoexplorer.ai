from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_google_llm(temperature: float = 0.0) -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        google_api_key=settings.GOOGLE_API_KEY,
        model="gemini-1.5-flash",
        temperature=temperature
    )
