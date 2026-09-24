from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PCCC PC08 API"
    API_V1_STR: str = "/api/v1"
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    LLM_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
