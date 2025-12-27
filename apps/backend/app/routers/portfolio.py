from datetime import date
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.portfolio import UserPortfolio, PortfolioHolding, PortfolioSnapshot
from app.services.portfolio_service import PortfolioService


router = APIRouter(prefix="/portfolio", tags=["portfolio"])


# Pydantic schemas for request/response
class HoldingCreate(BaseModel):
    symbol: str
    quantity: Decimal
    avg_buy_price: Optional[Decimal] = None


class PortfolioCreate(BaseModel):
    user_id: str
    name: str
    holdings: list[HoldingCreate] = []


class PortfolioUpdate(BaseModel):
    name: Optional[str] = None


class HoldingUpdate(BaseModel):
    quantity: Decimal
    avg_buy_price: Optional[Decimal] = None


class PortfolioResponse(BaseModel):
    id: int
    user_id: str
    name: str
    created_at: str

    class Config:
        from_attributes = True


@router.post("/")
async def create_portfolio(
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db)
):
    """Create a new portfolio for a user."""
    # Check if portfolio name already exists for user
    existing = db.query(UserPortfolio).filter(
        UserPortfolio.user_id == portfolio.user_id,
        UserPortfolio.name == portfolio.name
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Portfolio name already exists")

    # Create portfolio
    new_portfolio = UserPortfolio(
        user_id=portfolio.user_id,
        name=portfolio.name
    )
    db.add(new_portfolio)
    db.flush()

    # Add holdings
    for holding in portfolio.holdings:
        new_holding = PortfolioHolding(
            portfolio_id=new_portfolio.id,
            symbol=holding.symbol,
            quantity=holding.quantity,
            avg_buy_price=holding.avg_buy_price
        )
        db.add(new_holding)

    db.commit()
    return {
        "id": new_portfolio.id,
        "user_id": new_portfolio.user_id,
        "name": new_portfolio.name,
        "created_at": new_portfolio.created_at.isoformat()
    }


@router.get("/{user_id}")
async def get_user_portfolios(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get all portfolios for a user."""
    portfolios = db.query(UserPortfolio).filter(
        UserPortfolio.user_id == user_id
    ).all()

    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "name": p.name,
            "created_at": p.created_at.isoformat()
        }
        for p in portfolios
    ]


@router.get("/{portfolio_id}/holdings")
async def get_portfolio_holdings(
    portfolio_id: int,
    db: Session = Depends(get_db)
):
    """Get all holdings in a portfolio."""
    portfolio = db.query(UserPortfolio).filter(
        UserPortfolio.id == portfolio_id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings = db.query(PortfolioHolding).filter(
        PortfolioHolding.portfolio_id == portfolio_id
    ).all()

    return [
        {
            "id": h.id,
            "symbol": h.symbol,
            "quantity": str(h.quantity),
            "avg_buy_price": str(h.avg_buy_price) if h.avg_buy_price else None
        }
        for h in holdings
    ]


@router.post("/{portfolio_id}/holdings")
async def add_holding(
    portfolio_id: int,
    holding: HoldingCreate,
    db: Session = Depends(get_db)
):
    """Add a new holding to a portfolio."""
    portfolio = db.query(UserPortfolio).filter(
        UserPortfolio.id == portfolio_id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    # Check for duplicate holding
    existing = db.query(PortfolioHolding).filter(
        PortfolioHolding.portfolio_id == portfolio_id,
        PortfolioHolding.symbol == holding.symbol
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Holding already exists")

    new_holding = PortfolioHolding(
        portfolio_id=portfolio_id,
        symbol=holding.symbol,
        quantity=holding.quantity,
        avg_buy_price=holding.avg_buy_price
    )
    db.add(new_holding)
    db.commit()

    return {
        "id": new_holding.id,
        "symbol": new_holding.symbol,
        "quantity": str(new_holding.quantity),
        "avg_buy_price": str(new_holding.avg_buy_price) if new_holding.avg_buy_price else None
    }


@router.put("/{portfolio_id}/holdings/{holding_id}")
async def update_holding(
    portfolio_id: int,
    holding_id: int,
    update: HoldingUpdate,
    db: Session = Depends(get_db)
):
    """Update a holding in a portfolio."""
    holding = db.query(PortfolioHolding).filter(
        PortfolioHolding.id == holding_id,
        PortfolioHolding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    if update.quantity:
        holding.quantity = update.quantity
    if update.avg_buy_price is not None:
        holding.avg_buy_price = update.avg_buy_price

    db.commit()
    return {
        "id": holding.id,
        "symbol": holding.symbol,
        "quantity": str(holding.quantity),
        "avg_buy_price": str(holding.avg_buy_price) if holding.avg_buy_price else None
    }


@router.delete("/{portfolio_id}/holdings/{holding_id}")
async def delete_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db)
):
    """Remove a holding from a portfolio."""
    holding = db.query(PortfolioHolding).filter(
        PortfolioHolding.id == holding_id,
        PortfolioHolding.portfolio_id == portfolio_id
    ).first()

    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    db.delete(holding)
    db.commit()
    return {"status": "deleted"}


@router.get("/{portfolio_id}/performance")
async def get_portfolio_performance(
    portfolio_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get portfolio performance metrics and historical data."""
    portfolio = db.query(UserPortfolio).filter(
        UserPortfolio.id == portfolio_id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    service = PortfolioService(db)
    performance = service.get_portfolio_performance(portfolio_id, days)

    return performance


@router.get("/{portfolio_id}/news")
async def get_portfolio_relevant_news(
    portfolio_id: int,
    days: int = 7,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get relevant news for portfolio holdings."""
    portfolio = db.query(UserPortfolio).filter(
        UserPortfolio.id == portfolio_id
    ).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    service = PortfolioService(db)
    news = service.get_relevant_news(portfolio_id, days, limit)

    return {"news": news}


@router.post("/brief")
async def portfolio_brief(request: dict):
    """Generate portfolio analysis and narrative."""
    # Placeholder implementation
    return {
        "allocation": {},
        "stats": {},
        "risk_flags": [],
        "relevant_news": [],
        "macro_context": [],
        "narrative": {
            "summary": "",
            "risk": "",
            "macro": "",
            "actions": ""
        }
    }