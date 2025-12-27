"""Chart models for technical analysis and Druckenmiller-style signals."""

from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class ChartTimeseries(Base):
    """Store historical price data for charting and technical analysis."""

    __tablename__ = "chart_timeseries"
    __table_args__ = (
        Index("idx_symbol_date", "symbol", "date"),
        Index("idx_asset_class", "asset_class"),
        UniqueConstraint("symbol", "date", name="uq_symbol_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    asset_class = Column(String, nullable=False)  # 'equity', 'forex', 'commodity', 'bond'
    date = Column(Date, nullable=False)
    close_price = Column(Numeric, nullable=False)
    ma_8 = Column(Numeric)  # 8-period moving average
    ma_20 = Column(Numeric)  # 20-period moving average
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ChartSignal(Base):
    """Store technical signals (moving average crossovers) for charts."""

    __tablename__ = "chart_signals"
    __table_args__ = (
        Index("idx_symbol_timeframe_date", "symbol", "timeframe", "date"),
        Index("idx_signal_type", "signal_type"),
        UniqueConstraint("symbol", "timeframe", "date", name="uq_symbol_timeframe_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    timeframe = Column(String, nullable=False)  # 'daily', 'weekly', 'monthly'
    signal_date = Column(Date, nullable=False)
    signal_type = Column(String, nullable=False)  # 'bullish_cross', 'bearish_cross'
    ma_short = Column(Numeric)  # Short MA value at signal
    ma_long = Column(Numeric)  # Long MA value at signal
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChartMetadata(Base):
    """Metadata about which symbols are tracked and their asset classes."""

    __tablename__ = "chart_metadata"
    __table_args__ = (
        UniqueConstraint("symbol", "asset_class", name="uq_symbol_asset_class"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    asset_class = Column(String, nullable=False)  # 'equity', 'forex', 'commodity', 'bond'
    name = Column(String)  # Friendly name (e.g., "S&P 500", "EUR/USD")
    last_updated = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
