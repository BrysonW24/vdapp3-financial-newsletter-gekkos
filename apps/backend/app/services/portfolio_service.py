"""Portfolio service for calculating portfolio performance and fetching relevant data."""

from datetime import date
from decimal import Decimal
from typing import Optional

import httpx
from sqlalchemy.orm import Session

from app.models.portfolio import UserPortfolio, PortfolioHolding, PortfolioSnapshot
from app.models.news import News
from app.core.config import settings


class PortfolioService:
    """Service for portfolio management and analysis."""

    def __init__(self, db: Session):
        self.db = db

    async def get_current_prices(self, symbols: list[str]) -> dict[str, Decimal]:
        """
        Fetch current prices for given symbols from yfinance.

        Args:
            symbols: List of stock ticker symbols

        Returns:
            Dictionary mapping symbol to current price
        """
        if not symbols:
            return {}

        try:
            # Build URL for multiple symbols
            symbol_str = ",".join(symbols)
            async with httpx.AsyncClient() as client:
                # Using a free API endpoint or yfinance integration
                # This is a placeholder - implement actual API call
                prices = {}
                for symbol in symbols:
                    # TODO: Implement actual price fetching from yfinance or financial API
                    prices[symbol] = Decimal("0")
                return prices
        except Exception as e:
            raise Exception(f"Failed to fetch prices: {str(e)}")

    async def calculate_portfolio_value(
        self, portfolio_id: int, current_prices: dict[str, Decimal]
    ) -> tuple[Decimal, Decimal]:
        """
        Calculate total portfolio value and gain/loss.

        Args:
            portfolio_id: ID of the portfolio
            current_prices: Dictionary of symbol -> current price

        Returns:
            Tuple of (total_value, total_gain_loss)
        """
        holdings = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.portfolio_id == portfolio_id
        ).all()

        total_value = Decimal("0")
        total_cost = Decimal("0")

        for holding in holdings:
            current_price = current_prices.get(holding.symbol, Decimal("0"))
            holding_value = holding.quantity * current_price
            holding_cost = holding.quantity * (holding.avg_buy_price or Decimal("0"))

            total_value += holding_value
            total_cost += holding_cost

        total_gain_loss = total_value - total_cost
        return total_value, total_gain_loss

    def create_portfolio_snapshot(
        self,
        portfolio_id: int,
        snapshot_date: date,
        total_value: Decimal,
        total_gain_loss: Decimal,
    ) -> PortfolioSnapshot:
        """
        Create a portfolio snapshot for a given date.

        Args:
            portfolio_id: ID of the portfolio
            snapshot_date: Date of snapshot
            total_value: Total portfolio value
            total_gain_loss: Total gain/loss

        Returns:
            Created PortfolioSnapshot object
        """
        # Check if snapshot already exists for this date
        existing = self.db.query(PortfolioSnapshot).filter(
            PortfolioSnapshot.portfolio_id == portfolio_id,
            PortfolioSnapshot.snapshot_date == snapshot_date,
        ).first()

        if existing:
            existing.total_value = total_value
            existing.total_gain_loss = total_gain_loss
            self.db.commit()
            return existing

        # Build holdings JSON snapshot
        holdings = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.portfolio_id == portfolio_id
        ).all()

        holdings_json = {
            h.symbol: {
                "quantity": str(h.quantity),
                "avg_buy_price": str(h.avg_buy_price) if h.avg_buy_price else None,
            }
            for h in holdings
        }

        snapshot = PortfolioSnapshot(
            portfolio_id=portfolio_id,
            snapshot_date=snapshot_date,
            total_value=total_value,
            total_gain_loss=total_gain_loss,
            holdings_json=holdings_json,
        )
        self.db.add(snapshot)
        self.db.commit()
        return snapshot

    def get_portfolio_performance(
        self, portfolio_id: int, days: int = 30
    ) -> dict:
        """
        Get historical portfolio performance over the last N days.

        Args:
            portfolio_id: ID of the portfolio
            days: Number of days to look back

        Returns:
            Dictionary with performance metrics and historical data
        """
        from datetime import datetime, timedelta

        start_date = date.today() - timedelta(days=days)
        snapshots = self.db.query(PortfolioSnapshot).filter(
            PortfolioSnapshot.portfolio_id == portfolio_id,
            PortfolioSnapshot.snapshot_date >= start_date,
        ).order_by(PortfolioSnapshot.snapshot_date).all()

        if not snapshots:
            return {
                "performance": None,
                "historical": [],
                "current_value": None,
                "total_gain_loss": None,
            }

        current = snapshots[-1]
        first = snapshots[0]

        # Calculate returns
        start_value = first.total_value or Decimal("0")
        current_value = current.total_value or Decimal("0")
        period_return = (
            (current_value - start_value) / start_value * 100
            if start_value > 0
            else Decimal("0")
        )

        return {
            "performance": {
                "period_return_percent": float(period_return),
                "current_value": float(current_value),
                "total_gain_loss": float(current.total_gain_loss or Decimal("0")),
                "as_of_date": current.snapshot_date.isoformat(),
            },
            "historical": [
                {
                    "date": s.snapshot_date.isoformat(),
                    "value": float(s.total_value or Decimal("0")),
                    "gain_loss": float(s.total_gain_loss or Decimal("0")),
                }
                for s in snapshots
            ],
        }

    def get_relevant_news(
        self, portfolio_id: int, days: int = 7, limit: int = 20
    ) -> list[dict]:
        """
        Get news articles relevant to portfolio holdings.

        Args:
            portfolio_id: ID of the portfolio
            days: Number of days to look back
            limit: Maximum number of articles

        Returns:
            List of relevant news articles
        """
        from datetime import datetime, timedelta

        # Get portfolio symbols
        holdings = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.portfolio_id == portfolio_id
        ).all()

        if not holdings:
            return []

        symbols = [h.symbol for h in holdings]

        # Get relevant news - search by symbol or category
        start_date = date.today() - timedelta(days=days)
        news_articles = self.db.query(News).filter(
            News.published_at >= start_date,
        ).limit(limit).all()

        # Filter news that mentions portfolio symbols or related sectors
        relevant = [
            {
                "title": article.title,
                "summary": article.summary,
                "source": article.source,
                "url": article.url,
                "published_at": article.published_at.isoformat()
                if article.published_at
                else None,
                "category": article.category,
            }
            for article in news_articles
            if any(symbol.lower() in article.title.lower() for symbol in symbols)
            or article.category in ["stocks", "earnings"]
        ]

        return relevant[:limit]
