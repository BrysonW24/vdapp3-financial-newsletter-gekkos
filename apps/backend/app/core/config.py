from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Gekko Finance Intelligence"
    debug: bool = False
    version: str = "1.0.0"
    
    # Database
    database_url: str
    
    # External APIs
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    fmp_api_key: str | None = None
    newsdata_api_key: str | None = None
    
    # Redis for caching
    redis_url: str = "redis://localhost:6379"
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "https://yourdomain.com"]
    
    class Config:
        env_file = ".env"

settings = Settings()