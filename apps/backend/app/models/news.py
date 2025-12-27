from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    category = Column(String, index=True)
    title = Column(String)
    summary = Column(Text)
    url = Column(String)
    source = Column(String)
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    daily_run = relationship("DailyRun", back_populates="news")