from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_API_KEY: str = ""  # Should be set in .env or Render Env Vars
    CHROMA_DB_DIR: str = "./chroma_db"
    REPOS_DIR: str = "./cloned_repos"

    class Config:
        env_file = ".env"

settings = Settings()
