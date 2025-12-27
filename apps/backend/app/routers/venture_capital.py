"""API routes for venture capital, private companies, and equity tracking."""

from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.venture_capital_service import VentureCapitalService

router = APIRouter(prefix="/venture-capital", tags=["venture-capital"])


@router.get("/funds/{fund_id}/portfolio")
async def get_vc_fund_portfolio(
    fund_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all companies invested by a specific VC fund.

    Returns:
    - Fund information (AUM, status, exits)
    - List of all portfolio companies
    - Investment amounts and stake percentages
    - Board positions
    - Company valuations
    """
    service = VentureCapitalService(db)
    result = service.get_portfolio_by_vc_fund(fund_id)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return {
        "timestamp": datetime.now().isoformat(),
        **result
    }


@router.get("/ipo-pipeline")
async def get_ipo_pipeline(
    confidence: Optional[str] = Query(None, regex="^(high|medium|low)$"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get companies expected to go public soon.

    Query Parameters:
    - confidence: Filter by 'high', 'medium', or 'low' (optional)
    - limit: Maximum number of companies to return (default 50)

    Returns:
    - Current valuation and expected IPO valuation
    - Expected IPO year/quarter
    - Target exchange (NYSE, NASDAQ, etc.)
    - Readiness score (1-10)
    - Lead underwriter
    """
    service = VentureCapitalService(db)
    result = service.get_ipo_pipeline(confidence_level=confidence)

    # Apply limit
    pipeline = result.get("pipeline", [])[:limit]

    return {
        "timestamp": datetime.now().isoformat(),
        "total_ipo_candidates": result["total_ipo_candidates"],
        "high_confidence": result["high_confidence"],
        "medium_confidence": result["medium_confidence"],
        "low_confidence": result["low_confidence"],
        "limit": limit,
        "returned": len(pipeline),
        "pipeline": pipeline,
    }


@router.get("/landscape/{sector}")
async def get_sector_landscape(
    sector: str,
    db: Session = Depends(get_db)
):
    """
    Get overview of companies in a specific sector.

    Supported sectors:
    - AI: Artificial Intelligence companies
    - biotech: Biotechnology and life sciences
    - fintech: Financial technology
    - cleantech: Clean energy and sustainability
    - space: Space technology and commercial space
    - healthcare, proptech, etc.

    Returns:
    - Total companies and total valuation
    - Companies organized by funding stage
    - Average valuation per stage
    """
    service = VentureCapitalService(db)
    result = service.get_sector_overview(sector)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return {
        "timestamp": datetime.now().isoformat(),
        **result
    }


@router.get("/ai-landscape")
async def get_ai_startup_landscape(db: Session = Depends(get_db)):
    """
    Get overview of AI-focused companies by funding stage.

    Returns:
    - Total AI companies and total valuation
    - Companies grouped by funding stage (seed to pre-IPO)
    - Company count and average valuation per stage
    - Space tech flag for AI-enabled aerospace companies
    """
    service = VentureCapitalService(db)
    return {
        "timestamp": datetime.now().isoformat(),
        **service.get_ai_startup_landscape()
    }


@router.get("/space-tech-landscape")
async def get_space_tech_landscape(db: Session = Depends(get_db)):
    """
    Get overview of space technology companies.

    Returns:
    - Total space tech companies and valuation
    - Companies grouped by funding stage
    - Recent funding activity
    - Readiness for space market
    """
    service = VentureCapitalService(db)
    return {
        "timestamp": datetime.now().isoformat(),
        **service.get_space_tech_landscape()
    }


@router.get("/acquisitions")
async def track_acquisition_activity(
    days: int = Query(90, ge=1, le=365),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get recent M&A activity (acquisitions and mergers).

    Query Parameters:
    - days: Number of days to look back (default 90)
    - limit: Maximum number of deals to return (default 50)

    Returns:
    - Deal details (acquirer, target, price, status)
    - Deal type (acquisition, merger, consolidation)
    - Target company information
    - Total deal value in period
    """
    service = VentureCapitalService(db)
    result = service.track_acquisition_activity(days=days)

    deals = result.get("deals", [])[:limit]

    return {
        "timestamp": datetime.now().isoformat(),
        "period_days": days,
        "total_deals": result["total_deals"],
        "total_deal_value": result["total_deal_value"],
        "limit": limit,
        "returned": len(deals),
        "deals": deals,
    }


@router.get("/funding-rounds")
async def get_recent_funding_rounds(
    days: int = Query(90, ge=1, le=365),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get recent funding rounds from the past N days.

    Query Parameters:
    - days: Number of days to look back (default 90)
    - limit: Maximum number of rounds to return (default 50)

    Returns:
    - Company information and sector
    - Round type (seed, Series A-D+, growth)
    - Amount raised and valuation
    - Lead investor and total investor count
    - Announcement date
    """
    service = VentureCapitalService(db)
    result = service.get_recent_funding_rounds(days=days)

    rounds = result.get("rounds", [])[:limit]

    return {
        "timestamp": datetime.now().isoformat(),
        "period_days": days,
        "total_funding_rounds": result["total_funding_rounds"],
        "total_capital_raised": result["total_capital_raised"],
        "avg_round_size": result["avg_round_size"],
        "limit": limit,
        "returned": len(rounds),
        "rounds": rounds,
    }


@router.get("/valuations/{company_id}")
async def track_valuation_trends(
    company_id: int,
    db: Session = Depends(get_db)
):
    """
    Get valuation history and trends for a specific company.

    Returns:
    - Current estimated valuation
    - Historical valuation tracking
    - Valuation trend (up/down/flat)
    - Valuation sources (funding round, secondary market, etc.)
    - Valuation methods (pre-money, post-money, market price)
    """
    service = VentureCapitalService(db)
    result = service.track_valuation_trends(company_id)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return {
        "timestamp": datetime.now().isoformat(),
        **result
    }


@router.get("/funds/{fund_id}/returns")
async def calculate_fund_returns(
    fund_id: int,
    db: Session = Depends(get_db)
):
    """
    Get return metrics for a VC fund (estimated returns based on exits and valuations).

    Returns:
    - Total invested amount
    - Value from exited companies
    - Current portfolio value
    - Multiple on Invested Capital (MOIC)
    - Unrealized gains
    - Breakdown of exited vs active companies
    """
    service = VentureCapitalService(db)
    result = service.calculate_vc_fund_returns(fund_id)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return {
        "timestamp": datetime.now().isoformat(),
        **result
    }


@router.get("/investors")
async def get_top_investors(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get the most active investors ranked by investment count and capital deployed.

    Query Parameters:
    - limit: Maximum number of investors to return (default 20)

    Returns:
    - Investor name and type (VC, angel, corporate, PE, strategic)
    - Portfolio count (number of companies invested in)
    - Total capital invested
    - Average investment size
    """
    service = VentureCapitalService(db)
    result = service.get_top_investors(limit=limit)

    return {
        "timestamp": datetime.now().isoformat(),
        **result
    }


@router.get("/companies/{company_id}")
async def get_company_details(
    company_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific private company.

    Returns:
    - Company profile (sector, stage, status)
    - Valuation and revenue estimates
    - Employee count and founding information
    - Investor list with stakes
    - Funding round history
    - Acquisition details (if exited)
    - IPO pipeline status (if applicable)
    """
    from app.models.venture_capital import PrivateCompany

    company = db.query(PrivateCompany).filter(
        PrivateCompany.id == company_id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail=f"Company not found: {company_id}")

    # Get related data
    investors = [
        {
            "investor_name": inv.investor_name,
            "investor_type": inv.investor_type,
            "stake_percentage": float(inv.stake_percentage) if inv.stake_percentage else None,
            "invested_amount": float(inv.invested_amount) if inv.invested_amount else None,
            "board_member": inv.board_member,
            "lead_investor": inv.lead_investor,
        }
        for inv in company.investors
    ]

    funding_rounds = [
        {
            "round_type": fr.round_type,
            "round_number": fr.round_number,
            "announcement_date": fr.announcement_date.isoformat(),
            "amount_raised": float(fr.amount_raised),
            "valuation": float(fr.valuation) if fr.valuation else None,
            "lead_investor": fr.lead_investor,
            "investor_count": fr.investor_count,
        }
        for fr in company.funding_rounds
    ]

    return {
        "timestamp": datetime.now().isoformat(),
        "company": {
            "id": company.id,
            "name": company.company_name,
            "symbol": company.symbol,
            "sector": company.sector,
            "subsector": company.subsector,
            "description": company.description,
            "founded_date": company.founded_date.isoformat() if company.founded_date else None,
            "headquarters": company.headquarters,
            "website": company.website,
            "funding_stage": company.funding_stage,
            "status": company.status,
            "is_ai_focused": company.is_ai_focused,
            "is_space_tech": company.is_space_tech,
            "last_valuation": float(company.last_valuation) if company.last_valuation else None,
            "last_valuation_date": company.last_valuation_date.isoformat() if company.last_valuation_date else None,
            "estimated_valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
            "revenue_estimate": float(company.revenue_estimate) if company.revenue_estimate else None,
            "employee_count": company.employee_count,
        },
        "investors": {
            "count": len(investors),
            "list": investors,
        },
        "funding": {
            "total_rounds": len(funding_rounds),
            "rounds": funding_rounds,
        },
    }


@router.get("/summary")
async def get_vc_market_summary(
    db: Session = Depends(get_db)
):
    """
    Get high-level summary of the VC and startup ecosystem.

    Returns:
    - Total companies tracked
    - Total capital invested
    - Active funding by stage
    - Recent M&A activity summary
    - IPO pipeline status
    - Key sector metrics
    """
    service = VentureCapitalService(db)

    # Aggregate data from multiple queries
    ai_landscape = service.get_ai_startup_landscape()
    space_landscape = service.get_space_tech_landscape()
    recent_funding = service.get_recent_funding_rounds(days=90)
    recent_acquisitions = service.track_acquisition_activity(days=90)
    ipo_pipeline = service.get_ipo_pipeline()
    top_investors = service.get_top_investors(limit=10)

    return {
        "timestamp": datetime.now().isoformat(),
        "summary": {
            "total_ai_companies": ai_landscape["total_ai_companies"],
            "total_ai_valuation": ai_landscape["total_ai_valuation"],
            "total_space_tech_companies": space_landscape["total_space_tech_companies"],
            "total_space_tech_valuation": space_landscape["total_valuation"],
        },
        "recent_activity": {
            "funding_rounds_90d": recent_funding["total_funding_rounds"],
            "capital_raised_90d": recent_funding["total_capital_raised"],
            "acquisitions_90d": recent_acquisitions["total_deals"],
            "acquisition_value_90d": recent_acquisitions["total_deal_value"],
        },
        "ipo_pipeline": {
            "total_candidates": ipo_pipeline["total_ipo_candidates"],
            "high_confidence": ipo_pipeline["high_confidence"],
            "medium_confidence": ipo_pipeline["medium_confidence"],
            "low_confidence": ipo_pipeline["low_confidence"],
        },
        "top_investors": {
            "count": top_investors["top_investors"],
            "sample": top_investors["investors"][:5],
        },
    }
