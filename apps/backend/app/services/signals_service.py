"""Signals service for technical analysis and moving average crossovers."""

from datetime import date, timedelta
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session

from app.models.charts import ChartTimeseries, ChartSignal
from app.services.charts_service import ChartsService


class SignalsService:
    """Service for calculating technical signals and moving averages."""

    def __init__(self, db: Session):
        self.db = db
        self.charts_service = ChartsService(db)

    @staticmethod
    def calculate_moving_average(
        prices: list[Decimal],
        period: int
    ) -> list[Optional[Decimal]]:
        """
        Calculate simple moving average for a list of prices.

        Args:
            prices: List of prices in chronological order
            period: MA period (e.g., 8, 20)

        Returns:
            List of MA values (None for insufficient data points)
        """
        mas = []
        for i in range(len(prices)):
            if i < period - 1:
                mas.append(None)
            else:
                window = prices[i - period + 1 : i + 1]
                ma = sum(window) / Decimal(len(window))
                mas.append(ma)
        return mas

    def update_moving_averages(
        self,
        symbol: str,
        ma_period_short: int = 8,
        ma_period_long: int = 20
    ) -> int:
        """
        Calculate and update moving averages for a symbol.

        Args:
            symbol: Stock/asset ticker symbol
            ma_period_short: Short MA period
            ma_period_long: Long MA period

        Returns:
            Number of records updated
        """
        # Get all timeseries data for this symbol
        records = self.db.query(ChartTimeseries).filter(
            ChartTimeseries.symbol == symbol
        ).order_by(ChartTimeseries.date).all()

        if not records:
            return 0

        # Extract prices
        prices = [Decimal(str(r.close_price)) for r in records]

        # Calculate MAs
        mas_short = self.calculate_moving_average(prices, ma_period_short)
        mas_long = self.calculate_moving_average(prices, ma_period_long)

        # Update records
        count = 0
        for record, ma_8, ma_20 in zip(records, mas_short, mas_long):
            record.ma_8 = ma_8
            record.ma_20 = ma_20
            count += 1

        self.db.commit()
        return count

    def detect_crossovers(
        self,
        symbol: str,
        timeframe: str = "daily",
        target_date: Optional[date] = None
    ) -> Optional[ChartSignal]:
        """
        Detect moving average crossovers for a symbol on a specific date.

        Args:
            symbol: Stock/asset ticker symbol
            timeframe: 'daily', 'weekly', or 'monthly'
            target_date: Date to check for crossovers (defaults to today)

        Returns:
            ChartSignal object if crossover detected, None otherwise
        """
        if target_date is None:
            target_date = date.today()

        # Get data for current and previous periods
        current = self.db.query(ChartTimeseries).filter(
            ChartTimeseries.symbol == symbol,
            ChartTimeseries.date == target_date
        ).first()

        if not current or current.ma_8 is None or current.ma_20 is None:
            return None

        # Get previous day
        previous_date = target_date - timedelta(days=1)
        previous = self.db.query(ChartTimeseries).filter(
            ChartTimeseries.symbol == symbol,
            ChartTimeseries.date == previous_date
        ).first()

        if not previous or previous.ma_8 is None or previous.ma_20 is None:
            return None

        # Detect bullish crossover (MA8 crosses above MA20)
        prev_above = previous.ma_8 > previous.ma_20
        curr_above = current.ma_8 > current.ma_20

        signal_type = None
        if not prev_above and curr_above:
            signal_type = "bullish_cross"
        elif prev_above and not curr_above:
            signal_type = "bearish_cross"

        if not signal_type:
            return None

        # Check if signal already exists
        existing = self.db.query(ChartSignal).filter(
            ChartSignal.symbol == symbol,
            ChartSignal.timeframe == timeframe,
            ChartSignal.signal_date == target_date
        ).first()

        if existing:
            return existing

        # Create new signal
        signal = ChartSignal(
            symbol=symbol,
            timeframe=timeframe,
            signal_date=target_date,
            signal_type=signal_type,
            ma_short=current.ma_8,
            ma_long=current.ma_20
        )
        self.db.add(signal)
        self.db.commit()

        return signal

    def get_recent_signals(
        self,
        symbol: Optional[str] = None,
        days: int = 7,
        signal_type: Optional[str] = None
    ) -> list[dict]:
        """
        Get recent signals (crossovers).

        Args:
            symbol: Optional symbol filter
            days: Number of days to look back
            signal_type: Optional signal type filter ('bullish_cross', 'bearish_cross')

        Returns:
            List of signal dictionaries
        """
        start_date = date.today() - timedelta(days=days)

        query = self.db.query(ChartSignal).filter(
            ChartSignal.signal_date >= start_date
        )

        if symbol:
            query = query.filter(ChartSignal.symbol == symbol)

        if signal_type:
            query = query.filter(ChartSignal.signal_type == signal_type)

        signals = query.order_by(ChartSignal.signal_date.desc()).all()

        return [
            {
                "symbol": s.symbol,
                "timeframe": s.timeframe,
                "date": s.signal_date.isoformat(),
                "signal_type": s.signal_type,
                "ma_short": float(s.ma_short) if s.ma_short else None,
                "ma_long": float(s.ma_long) if s.ma_long else None,
            }
            for s in signals
        ]

    def get_bullish_signals(
        self,
        days: int = 7,
        asset_class: Optional[str] = None
    ) -> list[dict]:
        """
        Get all bullish signals from recent period.

        Args:
            days: Number of days to look back
            asset_class: Optional asset class filter

        Returns:
            List of bullish signals
        """
        start_date = date.today() - timedelta(days=days)

        query = self.db.query(ChartSignal).filter(
            ChartSignal.signal_type == "bullish_cross",
            ChartSignal.signal_date >= start_date
        )

        if asset_class:
            # Join with ChartTimeseries to filter by asset class
            query = query.join(ChartTimeseries).filter(
                ChartTimeseries.asset_class == asset_class
            )

        signals = query.order_by(ChartSignal.signal_date.desc()).all()

        return [
            {
                "symbol": s.symbol,
                "timeframe": s.timeframe,
                "date": s.signal_date.isoformat(),
                "signal_type": s.signal_type,
                "ma_short": float(s.ma_short) if s.ma_short else None,
                "ma_long": float(s.ma_long) if s.ma_long else None,
            }
            for s in signals
        ]
