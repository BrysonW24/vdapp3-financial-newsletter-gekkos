"""Charts service for fetching historical price data and managing chart timeseries."""

from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Optional

import httpx
import yfinance as yf
from sqlalchemy.orm import Session

from app.models.charts import ChartTimeseries, ChartMetadata
from app.core.config import settings


# Standard symbols tracked by Druckenmiller strategy
DRUCKENMILLER_SYMBOLS = {
    # Major equity indices
    "equity": [
        "^GSPC",  # S&P 500
        "^GDAXI",  # DAX
        "^N225",  # Nikkei 225
        "^FTSE",  # FTSE 100
        "^FCHI",  # CAC 40
        "^HSI",  # Hang Seng
        "^AXJO",  # ASX 200
        "^BVSP",  # Bovespa
        "^TWII",  # Taiwan Weighted
        "^KS11",  # Korea Composite
    ],
    # Major forex pairs (represented as currency crosses)
    "forex": [
        "EURUSD=X",  # EUR/USD
        "GBPUSD=X",  # GBP/USD
        "USDJPY=X",  # USD/JPY
        "AUDUSD=X",  # AUD/USD
        "USDCAD=X",  # USD/CAD
        "USDCNH=X",  # USD/CNH
    ],
    # Major commodities
    "commodity": [
        "GC=F",  # Gold
        "CL=F",  # Crude Oil
        "NG=F",  # Natural Gas
        "ZC=F",  # Corn
        "ZW=F",  # Wheat
        "HG=F",  # Copper
    ],
    # Bond yields
    "bond": [
        "^TNX",  # US 10-Year Yield
        "^TYX",  # US 30-Year Yield
        "^FVX",  # US 5-Year Yield
    ],
}


class ChartsService:
    """Service for managing chart data and technical analysis."""

    def __init__(self, db: Session):
        self.db = db

    async def fetch_historical_data(
        self,
        symbol: str,
        start_date: date,
        end_date: date,
        asset_class: str = "equity"
    ) -> list[dict]:
        """
        Fetch historical price data for a symbol using yfinance.

        Args:
            symbol: Stock/asset ticker symbol
            start_date: Start date for historical data
            end_date: End date for historical data
            asset_class: Asset class for the symbol

        Returns:
            List of price data dictionaries with date and close price
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(start=start_date, end=end_date)

            if hist.empty:
                return []

            # Convert to list of dicts
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
            raise Exception(f"Failed to fetch data for {symbol}: {str(e)}")

    def store_timeseries_data(
        self,
        symbol: str,
        asset_class: str,
        data: list[dict],
        ma_8: Optional[list[Decimal]] = None,
        ma_20: Optional[list[Decimal]] = None,
    ) -> int:
        """
        Store or update price data in the database.

        Args:
            symbol: Stock/asset ticker symbol
            asset_class: Asset class for the symbol
            data: List of price data dictionaries
            ma_8: Optional list of 8-period MA values
            ma_20: Optional list of 20-period MA values

        Returns:
            Number of rows inserted/updated
        """
        count = 0

        # Ensure metadata exists
        metadata = self.db.query(ChartMetadata).filter(
            ChartMetadata.symbol == symbol,
            ChartMetadata.asset_class == asset_class
        ).first()

        if not metadata:
            metadata = ChartMetadata(
                symbol=symbol,
                asset_class=asset_class,
                name=symbol
            )
            self.db.add(metadata)
            self.db.flush()

        # Store or update timeseries data
        for i, price_data in enumerate(data):
            existing = self.db.query(ChartTimeseries).filter(
                ChartTimeseries.symbol == symbol,
                ChartTimeseries.date == price_data["date"]
            ).first()

            ma_8_val = ma_8[i] if ma_8 and i < len(ma_8) else None
            ma_20_val = ma_20[i] if ma_20 and i < len(ma_20) else None

            if existing:
                existing.close_price = price_data["close_price"]
                existing.ma_8 = ma_8_val
                existing.ma_20 = ma_20_val
                existing.updated_at = datetime.now()
            else:
                timeseries = ChartTimeseries(
                    symbol=symbol,
                    asset_class=asset_class,
                    date=price_data["date"],
                    close_price=price_data["close_price"],
                    ma_8=ma_8_val,
                    ma_20=ma_20_val
                )
                self.db.add(timeseries)
            count += 1

        self.db.commit()
        return count

    def get_latest_timeseries(
        self,
        symbol: str,
        limit: int = 100
    ) -> list[dict]:
        """
        Get the latest timeseries data for a symbol.

        Args:
            symbol: Stock/asset ticker symbol
            limit: Maximum number of records to return

        Returns:
            List of timeseries records
        """
        records = self.db.query(ChartTimeseries).filter(
            ChartTimeseries.symbol == symbol
        ).order_by(ChartTimeseries.date.desc()).limit(limit).all()

        return [
            {
                "date": r.date.isoformat(),
                "close_price": float(r.close_price),
                "ma_8": float(r.ma_8) if r.ma_8 else None,
                "ma_20": float(r.ma_20) if r.ma_20 else None,
            }
            for r in reversed(records)
        ]

    def get_all_tracked_symbols(self) -> dict[str, list[str]]:
        """
        Get all tracked symbols grouped by asset class.

        Returns:
            Dictionary mapping asset class to list of symbols
        """
        metadata = self.db.query(ChartMetadata).all()

        result = {}
        for item in metadata:
            if item.asset_class not in result:
                result[item.asset_class] = []
            result[item.asset_class].append(item.symbol)

        return result

    async def initialize_tracked_symbols(self) -> int:
        """
        Initialize all Druckenmiller-style symbols in the database.

        Returns:
            Number of symbols initialized
        """
        count = 0
        for asset_class, symbols in DRUCKENMILLER_SYMBOLS.items():
            for symbol in symbols:
                existing = self.db.query(ChartMetadata).filter(
                    ChartMetadata.symbol == symbol,
                    ChartMetadata.asset_class == asset_class
                ).first()

                if not existing:
                    metadata = ChartMetadata(
                        symbol=symbol,
                        asset_class=asset_class,
                        name=symbol
                    )
                    self.db.add(metadata)
                    count += 1

        self.db.commit()
        return count
