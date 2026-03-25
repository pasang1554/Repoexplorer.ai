from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_API_KEY: str = "your_google_api_key_here"  # fallback if missing, though it should be set
    CHROMA_DB_DIR: str = "./chroma_db"
    REPOS_DIR: str = "./cloned_repos"

    class Config:
        env_file = ".env"

settings = Settings()
