from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Earnings(Base):
    __tablename__ = "earnings"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    symbol = Column(String)
    company_name = Column(String)
    eps_estimate = Column(Float, nullable=True)
    eps_actual = Column(Float, nullable=True)
    revenue_estimate = Column(Float, nullable=True)
    revenue_actual = Column(Float, nullable=True)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="earnings")