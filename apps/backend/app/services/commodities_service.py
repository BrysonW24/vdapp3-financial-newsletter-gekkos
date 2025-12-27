"""Commodities service for tracking precious metals, energy, and AI-critical materials."""

from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Optional

import yfinance as yf
from sqlalchemy.orm import Session

from app.models.commodities import CommodityPrice, CommoditySignal, AIMatrixMaterial, CommodityMetadata
from app.core.config import settings


# Commodity symbols for precious metals and AI materials
COMMODITY_SYMBOLS = {
    "precious_metal": {
        "gold": {
            "symbol": "GC=F",
            "name": "Gold Futures",
            "unit": "oz",
            "category": "precious_metal",
            "metal_type": "gold",
        },
        "silver": {
            "symbol": "SI=F",
            "name": "Silver Futures",
            "unit": "oz",
            "category": "precious_metal",
            "metal_type": "silver",
        },
        "copper": {
            "symbol": "HG=F",
            "name": "Copper Futures",
            "unit": "lb",
            "category": "precious_metal",
            "metal_type": "copper",
        },
        "platinum": {
            "symbol": "PL=F",
            "name": "Platinum Futures",
            "unit": "oz",
            "category": "precious_metal",
            "metal_type": "platinum",
        },
        "palladium": {
            "symbol": "PA=F",
            "name": "Palladium Futures",
            "unit": "oz",
            "category": "precious_metal",
            "metal_type": "palladium",
        },
    },
    "ai_material": {
        "lithium": {
            "symbol": "LIT",  # Lithium ETF
            "name": "Lithium (Critical for Batteries & AI Hardware)",
            "unit": "per_share",
            "category": "ai_material",
            "metal_type": "lithium",
        },
        "semiconductor": {
            "symbol": "SMH",  # Semiconductor ETF
            "name": "Semiconductors (AI Chips)",
            "unit": "per_share",
            "category": "ai_material",
            "metal_type": "semiconductor",
        },
        "rare_earth": {
            "symbol": "REMX",  # Rare Earth ETF
            "name": "Rare Earth Elements",
            "unit": "per_share",
            "category": "ai_material",
            "metal_type": "rare_earth",
        },
        "aluminum": {
            "symbol": "ALU=F",  # Aluminum Futures
            "name": "Aluminum (High-demand metal)",
            "unit": "ton",
            "category": "ai_material",
            "metal_type": "aluminum",
        },
        "nickel": {
            "symbol": "NI=F",  # Nickel Futures
            "name": "Nickel (EV batteries, Stainless steel)",
            "unit": "ton",
            "category": "ai_material",
            "metal_type": "nickel",
        },
    },
    "energy": {
        "crude_oil": {
            "symbol": "CL=F",
            "name": "Crude Oil Futures",
            "unit": "barrel",
            "category": "energy",
            "metal_type": "oil",
        },
        "natural_gas": {
            "symbol": "NG=F",
            "name": "Natural Gas Futures",
            "unit": "mmbtu",
            "category": "energy",
            "metal_type": "natural_gas",
        },
        "uranium": {
            "symbol": "URA",  # Uranium ETF
            "name": "Uranium (Nuclear energy)",
            "unit": "per_share",
            "category": "energy",
            "metal_type": "uranium",
        },
    },
}

# Space tech and critical materials
SPACE_TECH_MATERIALS = {
    "titanium": {
        "criticality": "high",
        "uses": ["aerospace", "spacecraft", "high-altitude aircraft"],
        "supply_risk": "medium",
    },
    "tungsten": {
        "criticality": "high",
        "uses": ["aerospace", "high-temperature applications"],
        "supply_risk": "high",
    },
    "cobalt": {
        "criticality": "high",
        "uses": ["batteries", "aerospace", "high-strength alloys"],
        "supply_risk": "high",
    },
    "gallium": {
        "criticality": "high",
        "uses": ["semiconductor", "solar cells", "missile systems"],
        "supply_risk": "high",
    },
}


class CommoditiesService:
    """Service for managing commodity price data and AI materials tracking."""

    def __init__(self, db: Session):
        self.db = db

    async def fetch_commodity_data(
        self,
        symbol: str,
        start_date: date,
        end_date: date,
        commodity_type: str = "precious_metal"
    ) -> list[dict]:
        """
        Fetch historical commodity price data.

        Args:
            symbol: Commodity ticker symbol (e.g., 'GC=F' for gold)
            start_date: Start date for historical data
            end_date: End date for historical data
            commodity_type: Type of commodity

        Returns:
            List of price data dictionaries
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(start=start_date, end=end_date)

            if hist.empty:
                return []

            data = []
            for idx, row in hist.iterrows():
                data.append({
                    "date": idx.date(),
                    "close_price": Decimal(str(row["Close"])),
                    "open_price": Decimal(str(row["Open"])),
                    "high_price": Decimal(str(row["High"])),
                    "low_price": Decimal(str(row["Low"])),
                    "volume": int(row["Volume"]) if row["Volume"] else 0,
                })

            return data

        except Exception as e:
            raise Exception(f"Failed to fetch commodity data for {symbol}: {str(e)}")

    def store_commodity_prices(
        self,
        symbol: str,
        category: str,
        metal_type: str,
        data: list[dict],
        ma_8: Optional[list[Decimal]] = None,
        ma_20: Optional[list[Decimal]] = None,
        price_aud: Optional[list[Decimal]] = None,
    ) -> int:
        """
        Store commodity price data in the database.

        Args:
            symbol: Commodity symbol
            category: Commodity category
            metal_type: Type of metal/material
            data: Price data
            ma_8: 8-period moving averages
            ma_20: 20-period moving averages
            price_aud: AUD-converted prices

        Returns:
            Number of records stored
        """
        count = 0

        # Ensure metadata exists
        metadata = self.db.query(CommodityMetadata).filter(
            CommodityMetadata.symbol == symbol,
            CommodityMetadata.category == category
        ).first()

        if not metadata:
            # Get name from COMMODITY_SYMBOLS
            name = None
            for cat, items in COMMODITY_SYMBOLS.items():
                for key, item_data in items.items():
                    if item_data["symbol"] == symbol:
                        name = item_data["name"]
                        break

            metadata = CommodityMetadata(
                symbol=symbol,
                category=category,
                metal_type=metal_type,
                name=name or symbol,
            )
            self.db.add(metadata)
            self.db.flush()

        # Store prices
        for i, price_data in enumerate(data):
            existing = self.db.query(CommodityPrice).filter(
                CommodityPrice.symbol == symbol,
                CommodityPrice.date == price_data["date"]
            ).first()

            ma_8_val = ma_8[i] if ma_8 and i < len(ma_8) else None
            ma_20_val = ma_20[i] if ma_20 and i < len(ma_20) else None
            price_aud_val = price_aud[i] if price_aud and i < len(price_aud) else None

            if existing:
                existing.price_per_unit = price_data["close_price"]
                existing.ma_8 = ma_8_val
                existing.ma_20 = ma_20_val
                existing.price_aud = price_aud_val
                existing.daily_volume = price_data.get("volume")
                existing.updated_at = datetime.now()
            else:
                commodity = CommodityPrice(
                    symbol=symbol,
                    category=category,
                    metal_type=metal_type,
                    date=price_data["date"],
                    price_per_unit=price_data["close_price"],
                    price_usd=price_data["close_price"],
                    price_aud=price_aud_val,
                    ma_8=ma_8_val,
                    ma_20=ma_20_val,
                    daily_volume=price_data.get("volume"),
                    open_price=price_data.get("open_price"),
                    high_price=price_data.get("high_price"),
                    low_price=price_data.get("low_price"),
                )
                self.db.add(commodity)
            count += 1

        self.db.commit()
        return count

    def get_precious_metals_overview(self) -> dict:
        """Get current status of all precious metals."""
        metals = ["gold", "silver", "copper", "platinum", "palladium"]
        overview = {}

        for metal in metals:
            latest = self.db.query(CommodityPrice).filter(
                CommodityPrice.metal_type == metal
            ).order_by(CommodityPrice.date.desc()).first()

            if latest:
                overview[metal] = {
                    "symbol": latest.symbol,
                    "price_usd": float(latest.price_usd) if latest.price_usd else None,
                    "price_aud": float(latest.price_aud) if latest.price_aud else None,
                    "ma_8": float(latest.ma_8) if latest.ma_8 else None,
                    "ma_20": float(latest.ma_20) if latest.ma_20 else None,
                    "date": latest.date.isoformat(),
                }

        return overview

    def get_ai_materials_overview(self) -> dict:
        """Get overview of AI-critical materials."""
        materials = self.db.query(AIMatrixMaterial).order_by(
            AIMatrixMaterial.date.desc()
        ).limit(50).all()

        return {
            "total_materials_tracked": len(set(m.material_name for m in materials)),
            "materials": [
                {
                    "name": m.material_name,
                    "price": float(m.price) if m.price else None,
                    "supply_risk": m.supply_risk,
                    "demand_trend": m.demand_trend,
                    "ai_relevance": m.ai_relevance,
                    "geopolitical_risk": m.geopolitical_risk,
                    "date": m.date.isoformat(),
                }
                for m in materials
            ]
        }

    def track_space_materials(self, material_name: str, price: Decimal, supply_risk: str):
        """Track materials critical for space technology."""
        ai_material = AIMatrixMaterial(
            symbol=material_name.upper(),
            material_name=material_name.lower(),
            element=material_name,
            date=date.today(),
            price=price,
            supply_risk=supply_risk,
            ai_relevance="critical" if material_name in SPACE_TECH_MATERIALS else "relevant",
            notes=f"Space tech material - {SPACE_TECH_MATERIALS.get(material_name, {}).get('uses', ['N/A'])[0]}"
        )
        self.db.add(ai_material)
        self.db.commit()
        return ai_material

    def get_all_tracked_commodities(self) -> dict:
        """Get all commodity tracking configuration."""
        return COMMODITY_SYMBOLS
