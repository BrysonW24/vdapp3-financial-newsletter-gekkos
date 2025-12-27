"""Venture capital and private equity services for tracking startups, funding, and M&A activity."""

from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Optional, List, Dict, Any

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.venture_capital import (
    PrivateCompany,
    FundingRound,
    CompanyInvestor,
    AcquisitionDeal,
    PrivateValuation,
    VentureCapitalFund,
    IPOPipeline,
)


class VentureCapitalService:
    """Service for managing venture capital and private company data."""

    def __init__(self, db: Session):
        self.db = db

    def get_portfolio_by_vc_fund(self, fund_id: int) -> Dict[str, Any]:
        """
        Get all companies invested by a specific VC fund.

        Args:
            fund_id: ID of the VC fund

        Returns:
            Dictionary with fund info and list of portfolio companies
        """
        fund = self.db.query(VentureCapitalFund).filter(
            VentureCapitalFund.id == fund_id
        ).first()

        if not fund:
            return {"error": "Fund not found"}

        # Get all companies where this fund is an investor
        investments = self.db.query(CompanyInvestor).filter(
            CompanyInvestor.investor_name == fund.fund_name
        ).all()

        companies = []
        total_invested = Decimal(0)

        for investment in investments:
            company = investment.company
            companies.append({
                "company_id": company.id,
                "company_name": company.company_name,
                "sector": company.sector,
                "funding_stage": company.funding_stage,
                "status": company.status,
                "is_ai_focused": company.is_ai_focused,
                "is_space_tech": company.is_space_tech,
                "estimated_valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "stake_percentage": float(investment.stake_percentage) if investment.stake_percentage else None,
                "invested_amount": float(investment.invested_amount) if investment.invested_amount else None,
                "board_member": investment.board_member,
                "lead_investor": investment.lead_investor,
            })
            if investment.invested_amount:
                total_invested += investment.invested_amount

        return {
            "fund": {
                "id": fund.id,
                "name": fund.fund_name,
                "type": fund.fund_type,
                "aum": float(fund.aum) if fund.aum else None,
                "headquarters": fund.headquarters,
                "focus_areas": fund.focus_areas,
                "status": fund.fund_status,
                "partner_count": fund.partner_count,
                "portfolio_size": fund.portfolio_size,
                "successful_exits": fund.successful_exits,
            },
            "portfolio": {
                "total_companies": len(companies),
                "total_invested": float(total_invested),
                "companies": companies,
            }
        }

    def get_ipo_pipeline(self, confidence_level: Optional[str] = None) -> Dict[str, Any]:
        """
        Get companies expected to go public soon.

        Args:
            confidence_level: Filter by 'high', 'medium', or 'low' confidence

        Returns:
            Dictionary with IPO pipeline companies sorted by readiness
        """
        query = self.db.query(IPOPipeline).join(
            PrivateCompany, IPOPipeline.company_id == PrivateCompany.id
        )

        if confidence_level:
            query = query.filter(IPOPipeline.confidence_level == confidence_level)

        pipeline = query.order_by(IPOPipeline.readiness_score.desc()).all()

        companies = []
        for ipo in pipeline:
            company = ipo.company
            companies.append({
                "company_id": company.id,
                "company_name": company.company_name,
                "sector": company.sector,
                "is_ai_focused": company.is_ai_focused,
                "is_space_tech": company.is_space_tech,
                "current_valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "expected_ipo_year": ipo.expected_ipo_year,
                "expected_ipo_quarter": ipo.expected_ipo_quarter,
                "expected_valuation": float(ipo.expected_valuation) if ipo.expected_valuation else None,
                "estimated_offering_size": float(ipo.estimated_offering_size) if ipo.estimated_offering_size else None,
                "target_exchange": ipo.target_exchange,
                "readiness_score": ipo.readiness_score,
                "confidence_level": ipo.confidence_level,
                "underwriter": ipo.underwriter,
                "notes": ipo.notes,
            })

        return {
            "total_ipo_candidates": len(companies),
            "high_confidence": len([c for c in companies if c["confidence_level"] == "high"]),
            "medium_confidence": len([c for c in companies if c["confidence_level"] == "medium"]),
            "low_confidence": len([c for c in companies if c["confidence_level"] == "low"]),
            "pipeline": companies,
        }

    def track_acquisition_activity(self, days: int = 30) -> Dict[str, Any]:
        """
        Get recent M&A activity from the past N days.

        Args:
            days: Number of days to look back

        Returns:
            Dictionary with acquisition deals sorted by date
        """
        cutoff_date = date.today() - timedelta(days=days)

        deals = self.db.query(AcquisitionDeal).filter(
            AcquisitionDeal.deal_date >= cutoff_date
        ).order_by(AcquisitionDeal.deal_date.desc()).all()

        acquisitions = []
        total_deal_value = Decimal(0)

        for deal in deals:
            company = deal.target_company
            acquisitions.append({
                "deal_id": deal.id,
                "target_company": company.company_name,
                "target_sector": company.sector,
                "target_is_ai": company.is_ai_focused,
                "target_is_space_tech": company.is_space_tech,
                "acquirer_name": deal.acquirer_name,
                "acquirer_type": deal.acquirer_type,
                "deal_date": deal.deal_date.isoformat(),
                "acquisition_price": float(deal.acquisition_price) if deal.acquisition_price else None,
                "deal_type": deal.deal_type,
                "status": deal.status,
                "notes": deal.notes,
            })
            if deal.acquisition_price:
                total_deal_value += deal.acquisition_price

        return {
            "period_days": days,
            "total_deals": len(acquisitions),
            "total_deal_value": float(total_deal_value),
            "deals": acquisitions,
        }

    def get_ai_startup_landscape(self) -> Dict[str, Any]:
        """
        Get overview of AI-focused companies by funding stage.

        Returns:
            Dictionary with AI companies grouped by stage and metrics
        """
        ai_companies = self.db.query(PrivateCompany).filter(
            PrivateCompany.is_ai_focused == True
        ).all()

        stages = {}
        total_valuation = Decimal(0)

        for company in ai_companies:
            stage = company.funding_stage or "unknown"
            if stage not in stages:
                stages[stage] = {
                    "count": 0,
                    "total_valuation": Decimal(0),
                    "companies": [],
                }

            stages[stage]["count"] += 1
            if company.estimated_valuation:
                stages[stage]["total_valuation"] += company.estimated_valuation
                total_valuation += company.estimated_valuation

            stages[stage]["companies"].append({
                "id": company.id,
                "name": company.company_name,
                "subsector": company.subsector,
                "is_space_tech": company.is_space_tech,
                "valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "revenue_estimate": float(company.revenue_estimate) if company.revenue_estimate else None,
                "employee_count": company.employee_count,
                "status": company.status,
            })

        # Format output
        landscape = {}
        for stage, data in stages.items():
            landscape[stage] = {
                "company_count": data["count"],
                "total_valuation": float(data["total_valuation"]),
                "avg_valuation": float(data["total_valuation"] / data["count"]) if data["count"] > 0 else 0,
                "companies": data["companies"],
            }

        return {
            "total_ai_companies": len(ai_companies),
            "total_ai_valuation": float(total_valuation),
            "by_stage": landscape,
        }

    def get_space_tech_landscape(self) -> Dict[str, Any]:
        """
        Get overview of space technology companies.

        Returns:
            Dictionary with space tech companies and metrics
        """
        space_companies = self.db.query(PrivateCompany).filter(
            PrivateCompany.is_space_tech == True
        ).all()

        companies = []
        total_valuation = Decimal(0)
        by_stage = {}

        for company in space_companies:
            stage = company.funding_stage or "unknown"
            if stage not in by_stage:
                by_stage[stage] = []

            company_data = {
                "id": company.id,
                "name": company.company_name,
                "sector": company.sector,
                "subsector": company.subsector,
                "founded_date": company.founded_date.isoformat() if company.founded_date else None,
                "headquarters": company.headquarters,
                "valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "status": company.status,
                "employee_count": company.employee_count,
            }
            companies.append(company_data)
            by_stage[stage].append(company_data)

            if company.estimated_valuation:
                total_valuation += company.estimated_valuation

        return {
            "total_space_tech_companies": len(companies),
            "total_valuation": float(total_valuation),
            "by_stage": {stage: {"count": len(comps), "companies": comps} for stage, comps in by_stage.items()},
            "companies": companies,
        }

    def calculate_vc_fund_returns(self, fund_id: int) -> Dict[str, Any]:
        """
        Estimate returns for a VC fund based on exits and current valuations.

        Args:
            fund_id: ID of the VC fund

        Returns:
            Dictionary with return metrics and IRR estimate
        """
        fund = self.db.query(VentureCapitalFund).filter(
            VentureCapitalFund.id == fund_id
        ).first()

        if not fund:
            return {"error": "Fund not found"}

        # Get all investments by this fund
        investments = self.db.query(CompanyInvestor).filter(
            CompanyInvestor.investor_name == fund.fund_name
        ).all()

        exited_companies = []
        active_companies = []
        total_invested = Decimal(0)
        total_exit_value = Decimal(0)
        current_portfolio_value = Decimal(0)

        for investment in investments:
            company = investment.company
            if investment.invested_amount:
                total_invested += investment.invested_amount

            if company.status in ["ipo", "acquired"]:
                # Company has exited
                exit_value = Decimal(0)

                # Try to find exit price from acquisitions
                if company.status == "acquired":
                    acquisition = self.db.query(AcquisitionDeal).filter(
                        AcquisitionDeal.target_company_id == company.id
                    ).first()
                    if acquisition and acquisition.acquisition_price:
                        exit_value = acquisition.acquisition_price
                        if investment.stake_percentage:
                            stake = investment.stake_percentage / 100
                            exit_value = exit_value * stake

                exited_companies.append({
                    "company_name": company.company_name,
                    "invested_amount": float(investment.invested_amount) if investment.invested_amount else 0,
                    "exit_value": float(exit_value),
                    "status": company.status,
                })
                total_exit_value += exit_value

            else:
                # Company still active
                current_value = Decimal(0)
                if company.estimated_valuation and investment.stake_percentage:
                    stake = investment.stake_percentage / 100
                    current_value = company.estimated_valuation * stake

                active_companies.append({
                    "company_name": company.company_name,
                    "invested_amount": float(investment.invested_amount) if investment.invested_amount else 0,
                    "current_value": float(current_value),
                    "stake_percentage": float(investment.stake_percentage) if investment.stake_percentage else None,
                })
                current_portfolio_value += current_value

        # Calculate returns
        total_value = total_exit_value + current_portfolio_value
        if total_invested > 0:
            multiple = float(total_value / total_invested)
        else:
            multiple = 0

        return {
            "fund": {
                "id": fund.id,
                "name": fund.fund_name,
                "aum": float(fund.aum) if fund.aum else None,
                "portfolio_size": fund.portfolio_size,
                "successful_exits": fund.successful_exits,
            },
            "returns": {
                "total_invested": float(total_invested),
                "exited_value": float(total_exit_value),
                "current_portfolio_value": float(current_portfolio_value),
                "total_value": float(total_value),
                "multiple": multiple,
                "unrealized_gain": float(current_portfolio_value - sum(
                    Decimal(inv["invested_amount"]) for inv in active_companies
                )) if active_companies else 0,
            },
            "exited_companies": exited_companies,
            "active_companies": active_companies,
        }

    def get_recent_funding_rounds(self, days: int = 90) -> Dict[str, Any]:
        """
        Get recent funding rounds from the past N days.

        Args:
            days: Number of days to look back

        Returns:
            Dictionary with recent funding activity sorted by date
        """
        cutoff_date = date.today() - timedelta(days=days)

        rounds = self.db.query(FundingRound).filter(
            FundingRound.announcement_date >= cutoff_date
        ).order_by(FundingRound.announcement_date.desc()).all()

        funding_data = []
        total_raised = Decimal(0)

        for round_data in rounds:
            company = round_data.company
            funding_data.append({
                "company_id": company.id,
                "company_name": company.company_name,
                "sector": company.sector,
                "is_ai_focused": company.is_ai_focused,
                "is_space_tech": company.is_space_tech,
                "round_type": round_data.round_type,
                "round_number": round_data.round_number,
                "announcement_date": round_data.announcement_date.isoformat(),
                "amount_raised": float(round_data.amount_raised),
                "valuation": float(round_data.valuation) if round_data.valuation else None,
                "lead_investor": round_data.lead_investor,
                "investor_count": round_data.investor_count,
                "notes": round_data.notes,
            })
            total_raised += round_data.amount_raised

        return {
            "period_days": days,
            "total_funding_rounds": len(funding_data),
            "total_capital_raised": float(total_raised),
            "avg_round_size": float(total_raised / len(funding_data)) if funding_data else 0,
            "rounds": funding_data,
        }

    def track_valuation_trends(self, company_id: int) -> Dict[str, Any]:
        """
        Get valuation history and trends for a specific company.

        Args:
            company_id: ID of the private company

        Returns:
            Dictionary with valuation history and trend metrics
        """
        company = self.db.query(PrivateCompany).filter(
            PrivateCompany.id == company_id
        ).first()

        if not company:
            return {"error": "Company not found"}

        valuations = self.db.query(PrivateValuation).filter(
            PrivateValuation.company_id == company_id
        ).order_by(PrivateValuation.valuation_date).all()

        valuation_history = []
        max_valuation = Decimal(0)
        min_valuation = Decimal(0)

        for val in valuations:
            valuation_history.append({
                "date": val.valuation_date.isoformat(),
                "valuation": float(val.valuation),
                "source": val.source,
                "method": val.valuation_method,
                "vs_previous": float(val.valuation_vs_previous) if val.valuation_vs_previous else None,
                "notes": val.notes,
            })
            if val.valuation > max_valuation:
                max_valuation = val.valuation
            if min_valuation == 0 or val.valuation < min_valuation:
                min_valuation = val.valuation

        # Calculate trend
        trend = None
        if len(valuation_history) >= 2:
            latest = valuations[-1].valuation
            previous = valuations[-2].valuation
            if latest > previous:
                trend = "up"
            elif latest < previous:
                trend = "down"
            else:
                trend = "flat"

        return {
            "company": {
                "id": company.id,
                "name": company.company_name,
                "sector": company.sector,
                "funding_stage": company.funding_stage,
                "status": company.status,
            },
            "valuations": {
                "current_valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "latest_known_valuation": float(valuations[-1].valuation) if valuations else None,
                "max_valuation": float(max_valuation),
                "min_valuation": float(min_valuation),
                "trend": trend,
                "history_count": len(valuation_history),
            },
            "history": valuation_history,
        }

    def get_sector_overview(self, sector: str) -> Dict[str, Any]:
        """
        Get overview of companies in a specific sector.

        Args:
            sector: Sector name (e.g., 'AI', 'biotech', 'fintech', 'cleantech', 'space')

        Returns:
            Dictionary with sector metrics and companies
        """
        companies = self.db.query(PrivateCompany).filter(
            PrivateCompany.sector == sector
        ).all()

        if not companies:
            return {"error": f"No companies found in sector: {sector}"}

        by_stage = {}
        total_valuation = Decimal(0)

        for company in companies:
            stage = company.funding_stage or "unknown"
            if stage not in by_stage:
                by_stage[stage] = []

            company_data = {
                "id": company.id,
                "name": company.company_name,
                "subsector": company.subsector,
                "founded_date": company.founded_date.isoformat() if company.founded_date else None,
                "funding_stage": stage,
                "status": company.status,
                "valuation": float(company.estimated_valuation) if company.estimated_valuation else None,
                "employee_count": company.employee_count,
            }
            by_stage[stage].append(company_data)

            if company.estimated_valuation:
                total_valuation += company.estimated_valuation

        return {
            "sector": sector,
            "total_companies": len(companies),
            "total_valuation": float(total_valuation),
            "avg_valuation": float(total_valuation / len(companies)) if companies else 0,
            "by_stage": {stage: {"count": len(comps), "companies": comps} for stage, comps in by_stage.items()},
        }

    def get_top_investors(self, limit: int = 20) -> Dict[str, Any]:
        """
        Get the most active investors by investment count.

        Args:
            limit: Maximum number of investors to return

        Returns:
            Dictionary with top investors and their portfolio stats
        """
        investor_stats = self.db.query(
            CompanyInvestor.investor_name,
            CompanyInvestor.investor_type,
            func.count(CompanyInvestor.id).label("portfolio_count"),
            func.sum(CompanyInvestor.invested_amount).label("total_invested"),
        ).group_by(
            CompanyInvestor.investor_name,
            CompanyInvestor.investor_type
        ).order_by(
            func.count(CompanyInvestor.id).desc()
        ).limit(limit).all()

        investors = []
        for stat in investor_stats:
            investors.append({
                "investor_name": stat.investor_name,
                "investor_type": stat.investor_type,
                "portfolio_count": stat.portfolio_count,
                "total_invested": float(stat.total_invested) if stat.total_invested else 0,
                "avg_investment": float(stat.total_invested / stat.portfolio_count) if stat.total_invested and stat.portfolio_count > 0 else 0,
            })

        return {
            "top_investors": len(investors),
            "investors": investors,
        }
