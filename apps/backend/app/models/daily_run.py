from sqlalchemy import Column, Integer, Date, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base

class DailyRun(Base):
    __tablename__ = "daily_runs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Market data as JSON
    market_data = Column(JSON)
    macro_data = Column(JSON)

    # Relationships
    news = relationship("News", back_populates="daily_run")
    earnings = relationship("Earnings", back_populates="daily_run")
    ipos = relationship("IPOs", back_populates="daily_run")
    charts = relationship("Chart", back_populates="daily_run")
    content = relationship("Content", back_populates="daily_run")