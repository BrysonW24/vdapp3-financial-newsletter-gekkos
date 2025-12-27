from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
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

class SectorSnapshot(Base):
    __tablename__ = "sector_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    name = Column(String)
    symbol = Column(String)
    change_percent = Column(Float)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="sectors")

class CryptoAssetSnapshot(Base):
    __tablename__ = "crypto_asset_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    name = Column(String)
    symbol = Column(String)
    price_usd = Column(Float)
    price_aud = Column(Float)
    change_24h = Column(Float)
    market_cap = Column(Float)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="crypto_assets")

class CryptoMarketSummary(Base):
    __tablename__ = "crypto_market_summaries"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    total_market_cap = Column(Float)
    total_volume = Column(Float)
    market_cap_change_percentage_24h_usd = Column(Float)
    fear_greed_index = Column(Integer)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="crypto_market_summary")

class MacroIndicatorSnapshot(Base):
    __tablename__ = "macro_indicator_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    daily_run_id = Column(Integer, ForeignKey("daily_runs.id"))
    name = Column(String)
    value = Column(Float)
    unit = Column(String)
    change = Column(Float, nullable=True)
    date = Column(Date)

    daily_run = relationship("DailyRun", back_populates="macro_indicators")