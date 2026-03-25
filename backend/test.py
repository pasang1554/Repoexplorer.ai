from app.services.google_service import get_google_llm
import asyncio

async def test():
    try:
        llm = get_google_llm()
        resp = await llm.ainvoke("hi")
        print(resp)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
