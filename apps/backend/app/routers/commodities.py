"""API routes for commodities, precious metals, and AI-critical materials tracking."""

from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.commodities import CommodityPrice, CommoditySignal, AIMatrixMaterial
from app.services.commodities_service import CommoditiesService

router = APIRouter(prefix="/commodities", tags=["commodities"])


@router.get("/overview")
async def get_commodities_overview(db: Session = Depends(get_db)):
    """
    Get current overview of all tracked commodities.

    Returns:
    - Precious metals (gold, silver, copper, platinum, palladium)
    - AI materials (lithium, semiconductors, rare earth elements)
    - Energy (crude oil, natural gas, uranium)
    - Space tech materials
    """
    service = CommoditiesService(db)

    precious_metals = service.get_precious_metals_overview()
    ai_materials = service.get_ai_materials_overview()
    all_tracked = service.get_all_tracked_commodities()

    return {
        "timestamp": datetime.now().isoformat(),
        "precious_metals": precious_metals,
        "ai_materials": ai_materials,
        "total_commodities_tracked": len(all_tracked.get("precious_metal", {})) +
                                     len(all_tracked.get("ai_material", {})) +
                                     len(all_tracked.get("energy", {})),
    }


@router.get("/metals/{metal_type}")
async def get_metal_prices(
    metal_type: str,
    days: int = Query(30, ge=1, le=365, description="Number of days of historical data"),
    db: Session = Depends(get_db)
):
    """
    Get current and historical prices for a specific metal or material.

    Metal types:
    - precious_metals: gold, silver, copper, platinum, palladium
    - ai_materials: lithium, semiconductor, rare_earth, aluminum, nickel
    - energy: crude_oil, natural_gas, uranium

    Returns:
    - Current price (USD and AUD)
    - 8-period and 20-period moving averages
    - Historical prices for the specified period
    - Price trend
    """
    metal_type_lower = metal_type.lower()

    # Get latest prices
    latest_prices = db.query(CommodityPrice).filter(
        CommodityPrice.metal_type == metal_type_lower
    ).order_by(CommodityPrice.date.desc()).limit(1).all()

    if not latest_prices:
        raise HTTPException(status_code=404, detail=f"No data found for metal type: {metal_type}")

    latest = latest_prices[0]

    # Get historical data
    cutoff_date = date.today() - timedelta(days=days)
    history = db.query(CommodityPrice).filter(
        CommodityPrice.metal_type == metal_type_lower,
        CommodityPrice.date >= cutoff_date
    ).order_by(CommodityPrice.date).all()

    # Calculate trend
    trend = None
    if len(history) >= 2:
        if history[-1].price_per_unit > history[-2].price_per_unit:
            trend = "up"
        elif history[-1].price_per_unit < history[-2].price_per_unit:
            trend = "down"
        else:
            trend = "flat"

    return {
        "metal_type": metal_type_lower,
        "current": {
            "price_usd": float(latest.price_usd) if latest.price_usd else None,
            "price_aud": float(latest.price_aud) if latest.price_aud else None,
            "ma_8": float(latest.ma_8) if latest.ma_8 else None,
            "ma_20": float(latest.ma_20) if latest.ma_20 else None,
            "date": latest.date.isoformat(),
        },
        "trend": trend,
        "period_days": days,
        "data_points": len(history),
        "historical": [
            {
                "date": price.date.isoformat(),
                "price_usd": float(price.price_usd) if price.price_usd else None,
                "price_aud": float(price.price_aud) if price.price_aud else None,
                "ma_8": float(price.ma_8) if price.ma_8 else None,
                "ma_20": float(price.ma_20) if price.ma_20 else None,
                "volume": price.daily_volume,
            }
            for price in history
        ]
    }


@router.get("/signals/{metal_type}")
async def get_commodity_signals(
    metal_type: str,
    days: int = Query(30, ge=1, le=365),
    signal_type: Optional[str] = Query(None, regex="^(bullish|bearish)$"),
    db: Session = Depends(get_db)
):
    """
    Get technical signals for a commodity (bullish/bearish crossovers).

    Returns:
    - All signals for the commodity in the specified timeframe
    - Optional filter by signal type (bullish/bearish)
    - Signal strength (1-10)
    - Timestamp of signal detection
    """
    cutoff_date = date.today() - timedelta(days=days)

    query = db.query(CommoditySignal).filter(
        CommoditySignal.metal_type == metal_type.lower(),
        CommoditySignal.signal_date >= cutoff_date
    )

    if signal_type:
        query = query.filter(CommoditySignal.signal_type == signal_type)

    signals = query.order_by(CommoditySignal.signal_date.desc()).all()

    if not signals:
        return {
            "metal_type": metal_type.lower(),
            "period_days": days,
            "signal_count": 0,
            "signals": [],
        }

    return {
        "metal_type": metal_type.lower(),
        "period_days": days,
        "signal_count": len(signals),
        "bullish_count": len([s for s in signals if s.signal_type == "bullish"]),
        "bearish_count": len([s for s in signals if s.signal_type == "bearish"]),
        "signals": [
            {
                "signal_type": signal.signal_type,
                "signal_date": signal.signal_date.isoformat(),
                "strength": signal.strength,
                "price_at_signal": float(signal.price_at_signal) if signal.price_at_signal else None,
                "ma_8": float(signal.ma_8) if signal.ma_8 else None,
                "ma_20": float(signal.ma_20) if signal.ma_20 else None,
                "timeframe": signal.timeframe,
            }
            for signal in signals
        ]
    }


@router.get("/ai-materials")
async def get_ai_materials_overview(db: Session = Depends(get_db)):
    """
    Get comprehensive overview of AI-critical materials.

    Returns:
    - Current prices and trends
    - Supply risk assessment (high/medium/low)
    - Demand trends
    - AI relevance ratings
    - Geopolitical risk indicators
    """
    service = CommoditiesService(db)
    return service.get_ai_materials_overview()


@router.get("/space-tech/{material}")
async def get_space_tech_material(
    material: str,
    db: Session = Depends(get_db)
):
    """
    Get information about space technology materials.

    Materials tracked:
    - titanium, tungsten, cobalt, gallium
    - Any AI materials used in aerospace/space applications

    Returns:
    - Current price
    - Supply risk assessment
    - Criticality level
    - Use cases in space industry
    - Supply chain status
    """
    material_lower = material.lower()

    # Get latest data for this material
    latest = db.query(AIMatrixMaterial).filter(
        AIMatrixMaterial.material_name == material_lower
    ).order_by(AIMatrixMaterial.date.desc()).first()

    if not latest:
        raise HTTPException(status_code=404, detail=f"No data found for material: {material}")

    return {
        "material": material_lower,
        "current": {
            "price": float(latest.price) if latest.price else None,
            "date": latest.date.isoformat(),
        },
        "supply_risk": latest.supply_risk,
        "demand_trend": latest.demand_trend,
        "ai_relevance": latest.ai_relevance,
        "geopolitical_risk": latest.geopolitical_risk,
        "notes": latest.notes,
    }


@router.get("/configuration")
async def get_commodities_configuration(db: Session = Depends(get_db)):
    """
    Get the complete configuration of tracked commodities.

    Returns:
    - All tracked symbols
    - Categories and metal types
    - Units of measurement
    - Data availability
    """
    service = CommoditiesService(db)
    config = service.get_all_tracked_commodities()

    # Transform into API-friendly format
    result = {}
    for category, items in config.items():
        result[category] = {
            "count": len(items),
            "items": [
                {
                    "key": key,
                    "symbol": item.get("symbol"),
                    "name": item.get("name"),
                    "unit": item.get("unit"),
                    "metal_type": item.get("metal_type"),
                }
                for key, item in items.items()
            ]
        }

    return {
        "timestamp": datetime.now().isoformat(),
        "total_commodities": sum(cat["count"] for cat in result.values()),
        "categories": result,
    }


@router.get("/trending")
async def get_trending_commodities(
    period_days: int = Query(7, ge=1, le=90),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get trending commodities by percentage change over a period.

    Returns:
    - Top gainers
    - Top losers
    - Sorted by percentage change
    """
    cutoff_date = date.today() - timedelta(days=period_days)

    # Get all unique metal types and their latest/oldest prices in period
    from sqlalchemy import func

    all_metals = db.query(CommodityPrice.metal_type).distinct().all()
    trends = []

    for (metal_type,) in all_metals:
        prices = db.query(CommodityPrice).filter(
            CommodityPrice.metal_type == metal_type,
            CommodityPrice.date >= cutoff_date
        ).order_by(CommodityPrice.date).all()

        if len(prices) >= 2:
            oldest_price = float(prices[0].price_per_unit)
            latest_price = float(prices[-1].price_per_unit)

            if oldest_price > 0:
                pct_change = ((latest_price - oldest_price) / oldest_price) * 100
                trends.append({
                    "metal_type": metal_type,
                    "period_days": period_days,
                    "oldest_price": oldest_price,
                    "latest_price": latest_price,
                    "change_pct": round(pct_change, 2),
                    "oldest_date": prices[0].date.isoformat(),
                    "latest_date": prices[-1].date.isoformat(),
                })

    # Sort by percentage change
    trends.sort(key=lambda x: x["change_pct"], reverse=True)

    gainers = trends[:limit]
    losers = trends[-limit:][::-1]  # Reverse to show biggest losers first

    return {
        "period_days": period_days,
        "top_gainers": gainers,
        "top_losers": losers,
    }
