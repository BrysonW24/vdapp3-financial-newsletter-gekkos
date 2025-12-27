from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class IndexSnapshot(Base):
    __tablename__ = "index_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    symbol = Column(String)
    name = Column(String)
    value = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    volume = Column(Float, nullable=True)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="indices")