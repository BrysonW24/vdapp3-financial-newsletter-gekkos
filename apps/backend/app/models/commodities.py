"""Commodity models for tracking precious metals, energy, and AI materials."""

from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class CommodityPrice(Base):
    """Store commodity price data (precious metals, energy, AI materials)."""

    __tablename__ = "commodity_prices"
    __table_args__ = (
        Index("idx_symbol_date", "symbol", "date"),
        Index("idx_category", "category"),
        Index("idx_metal_type", "metal_type"),
        UniqueConstraint("symbol", "date", name="uq_commodity_symbol_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)  # GC=F, SI=F, CL=F, etc.
    category = Column(String, nullable=False)  # 'precious_metal', 'energy', 'ai_material', 'industrial'
    metal_type = Column(String, nullable=False)  # 'gold', 'silver', 'copper', 'lithium', 'rare_earth', 'oil', 'natural_gas'
    date = Column(Date, nullable=False)
    price_per_unit = Column(Numeric, nullable=False)  # Price per oz, barrel, ton, etc.
    price_usd = Column(Numeric)  # Standardized to USD
    price_aud = Column(Numeric)  # AUD conversion
    ma_8 = Column(Numeric)  # 8-period moving average
    ma_20 = Column(Numeric)  # 20-period moving average
    daily_volume = Column(Numeric)  # Trading volume
    open_price = Column(Numeric)
    high_price = Column(Numeric)
    low_price = Column(Numeric)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CommoditySignal(Base):
    """Store commodity trading signals (MA crossovers for metals and energy)."""

    __tablename__ = "commodity_signals"
    __table_args__ = (
        Index("idx_symbol_timeframe_date", "symbol", "timeframe", "date"),
        Index("idx_metal_type_signal", "metal_type", "signal_type"),
        UniqueConstraint("symbol", "timeframe", "date", name="uq_commodity_signal"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    metal_type = Column(String, nullable=False)  # 'gold', 'silver', 'copper', etc.
    timeframe = Column(String, nullable=False)  # 'daily', 'weekly', 'monthly'
    signal_date = Column(Date, nullable=False)
    signal_type = Column(String, nullable=False)  # 'bullish_cross', 'bearish_cross'
    ma_short = Column(Numeric)
    ma_long = Column(Numeric)
    strength = Column(String)  # 'strong', 'medium', 'weak' - based on volume
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AIMatrixMaterial(Base):
    """Track AI-critical materials and their demand trends."""

    __tablename__ = "ai_matrix_materials"
    __table_args__ = (
        Index("idx_material_name", "material_name"),
        Index("idx_element", "element"),
        UniqueConstraint("symbol", "date", name="uq_ai_material"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)  # NVDA for GPU context, or material ticker
    material_name = Column(String, nullable=False)  # 'lithium', 'cobalt', 'nickel', 'rare_earth', 'silicon', 'gallium'
    element = Column(String)  # Chemical element symbol
    date = Column(Date, nullable=False)
    price = Column(Numeric)  # Current price
    supply_risk = Column(String)  # 'high', 'medium', 'low'
    demand_trend = Column(String)  # 'increasing', 'stable', 'decreasing'
    ai_relevance = Column(String)  # 'critical' for GPUs/AI chips, 'important' for batteries, 'relevant' for other uses
    production_capacity_increase = Column(Numeric)  # Percentage of capacity expansion YoY
    geopolitical_risk = Column(String)  # 'high', 'medium', 'low' - supply chain risk
    notes = Column(String)  # Commentary on mining, processing, or supply chain
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CommodityMetadata(Base):
    """Metadata about tracked commodities."""

    __tablename__ = "commodity_metadata"
    __table_args__ = (
        UniqueConstraint("symbol", "category", name="uq_commodity_metadata"),
    )

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    metal_type = Column(String)
    name = Column(String)  # Friendly name
    unit = Column(String)  # 'oz', 'barrel', 'ton', 'lb', etc.
    description = Column(String)
    last_updated = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
