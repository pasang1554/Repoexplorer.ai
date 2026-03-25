from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def test_model(model_name):
    print(f"Testing {model_name}...")
    try:
        llm = ChatGoogleGenerativeAI(
            google_api_key=settings.GOOGLE_API_KEY,
            model=model_name
        )
        print("Success:", llm.invoke("hi").content)
    except Exception as e:
        print("Failed:", str(e)[:100])

if __name__ == "__main__":
    test_model("gemini-1.5-flash")
    test_model("gemini-1.5-pro")
    test_model("gemini-pro")
    test_model("models/gemini-1.5-flash")
