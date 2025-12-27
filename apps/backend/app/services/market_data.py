import httpx
from typing import Dict, Any
from app.core.config import settings

class MarketDataService:
    """Service for fetching market data from various APIs."""

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)

    async def get_alpha_vantage_quote(self, symbol: str) -> Dict[str, Any]:
        """Fetch quote data from Alpha Vantage."""
        url = f"{settings.alpha_vantage_base_url}/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": settings.alpha_vantage_api_key
        }
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_coingecko_price(self, ids: str, vs_currencies: str = "usd,aud", include_24hr_change: bool = True) -> Dict[str, Any]:
        """Fetch cryptocurrency prices from CoinGecko."""
        url = f"{settings.coingecko_base_url}/simple/price"
        params = {
            "ids": ids,
            "vs_currencies": vs_currencies,
            "include_24hr_change": str(include_24hr_change).lower()
        }
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_coingecko_global(self) -> Dict[str, Any]:
        """Fetch global crypto market data from CoinGecko."""
        url = f"{settings.coingecko_base_url}/global"
        response = await self.client.get(url)
        response.raise_for_status()
        return response.json()

    async def get_fear_greed_index(self, limit: int = 1) -> Dict[str, Any]:
        """Fetch Fear & Greed Index."""
        url = settings.fear_greed_base_url
        params = {"limit": limit, "format": "json"}
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_trading_economics_indicator(self, series: str) -> Dict[str, Any]:
        """Fetch economic indicator from Trading Economics."""
        url = f"{settings.trading_economics_base_url}/historical"
        params = {
            "s": series,
            "fmt": "json"
        }
        headers = {"Authorization": f"Bearer {settings.trading_economics_api_key}"}
        response = await self.client.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

# Global service instance
market_data_service = MarketDataService()