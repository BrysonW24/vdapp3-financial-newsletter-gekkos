from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.daily_run import DailyRun
from app.models.snapshots import IndexSnapshot, SectorSnapshot, CryptoAssetSnapshot, CryptoMarketSummary, MacroIndicatorSnapshot
from app.models.news import News
from app.models.earnings import Earnings
from app.models.events import IPOs
from app.models.content import Content

router = APIRouter()

@router.get("/")
async def get_daily_markets(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """
    Get daily markets data for today or specified date.
    Returns the complete daily pack including market data, news, earnings, etc.
    """
    if target_date is None:
        target_date = date.today()

    # Get the daily run for the target date
    daily_run = db.query(DailyRun).filter(DailyRun.date == target_date).first()
    if not daily_run:
        raise HTTPException(status_code=404, detail=f"No data available for {target_date}")

    # Fetch related data
    indices = db.query(IndexSnapshot).filter(IndexSnapshot.daily_run_id == daily_run.id).all()
    sectors = db.query(SectorSnapshot).filter(SectorSnapshot.daily_run_id == daily_run.id).all()
    crypto_assets = db.query(CryptoAssetSnapshot).filter(CryptoAssetSnapshot.daily_run_id == daily_run.id).all()
    crypto_summary = db.query(CryptoMarketSummary).filter(CryptoMarketSummary.daily_run_id == daily_run.id).first()
    macro_indicators = db.query(MacroIndicatorSnapshot).filter(MacroIndicatorSnapshot.daily_run_id == daily_run.id).all()
    news = db.query(News).filter(News.daily_run_id == daily_run.id).all()
    earnings = db.query(Earnings).filter(Earnings.daily_run_id == daily_run.id).all()
    ipos = db.query(IPOs).filter(IPOs.daily_run_id == daily_run.id).all()
    content = db.query(Content).filter(Content.daily_run_id == daily_run.id).all()

    # Structure the response
    response = {
        "date": daily_run.date,
        "market_data": {
            "indices": [
                {
                    "symbol": idx.symbol,
                    "name": idx.name,
                    "value": idx.value,
                    "change": idx.change,
                    "change_percent": idx.change_percent,
                    "volume": idx.volume
                } for idx in indices
            ],
            "sectors": [
                {
                    "name": sector.name,
                    "symbol": sector.symbol,
                    "change_percent": sector.change_percent
                } for sector in sectors
            ],
            "crypto": {
                "assets": [
                    {
                        "name": asset.name,
                        "symbol": asset.symbol,
                        "price_usd": asset.price_usd,
                        "price_aud": asset.price_aud,
                        "change_24h": asset.change_24h,
                        "market_cap": asset.market_cap
                    } for asset in crypto_assets
                ],
                "summary": {
                    "total_market_cap": crypto_summary.total_market_cap if crypto_summary else None,
                    "total_volume": crypto_summary.total_volume if crypto_summary else None,
                    "market_cap_change_percentage_24h_usd": crypto_summary.market_cap_change_percentage_24h_usd if crypto_summary else None,
                    "fear_greed_index": crypto_summary.fear_greed_index if crypto_summary else None
                } if crypto_summary else {}
            }
        },
        "macro_data": {
            "indicators": [
                {
                    "name": indicator.name,
                    "value": indicator.value,
                    "unit": indicator.unit,
                    "change": indicator.change
                } for indicator in macro_indicators
            ]
        },
        "news": [
            {
                "category": article.category,
                "title": article.title,
                "summary": article.summary,
                "url": article.url,
                "source": article.source,
                "published_at": article.published_at
            } for article in news
        ],
        "earnings": [
            {
                "symbol": earning.symbol,
                "company_name": earning.company_name,
                "eps_estimate": earning.eps_estimate,
                "eps_actual": earning.eps_actual,
                "revenue_estimate": earning.revenue_estimate,
                "revenue_actual": earning.revenue_actual,
                "date": earning.date
            } for earning in earnings
        ],
        "ipos": [
            {
                "symbol": ipo.symbol,
                "company_name": ipo.company_name,
                "ipo_date": ipo.ipo_date,
                "price_range": ipo.price_range,
                "shares_offered": ipo.shares_offered
            } for ipo in ipos
        ],
        "content": [
            {
                "type": item.type,
                "content": item.content,
                "generated_by": item.generated_by
            } for item in content
        ]
    }

    return response

@router.get("/health")
async def daily_health():
    """Health check for daily markets service."""
    return {"status": "healthy", "service": "daily_markets"}