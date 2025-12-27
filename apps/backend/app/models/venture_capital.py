"""Venture capital and private equity models for tracking early-stage and private companies."""

from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, ForeignKey, Index, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class PrivateCompany(Base):
    """Track private companies and startups."""

    __tablename__ = "private_companies"
    __table_args__ = (
        Index("idx_company_name", "company_name"),
        Index("idx_sector", "sector"),
        Index("idx_stage", "funding_stage"),
        Index("idx_status", "status"),
    )

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False, unique=True, index=True)
    symbol = Column(String)  # Internal code/ticker if available
    sector = Column(String, nullable=False)  # 'AI', 'biotech', 'fintech', 'cleantech', 'space', etc.
    subsector = Column(String)  # More specific category
    description = Column(String)  # Company description
    founded_date = Column(Date)
    headquarters = Column(String)  # City, Country
    website = Column(String)
    funding_stage = Column(String, nullable=False)  # 'seed', 'series_a', 'series_b', 'series_c', 'series_d+', 'pre_ipo'
    status = Column(String, nullable=False)  # 'active', 'acquired', 'ipo', 'shut_down'
    is_ai_focused = Column(Boolean, default=False)  # Flag for AI companies
    is_space_tech = Column(Boolean, default=False)  # Flag for space tech
    last_valuation = Column(Numeric)  # Last known valuation in USD
    last_valuation_date = Column(Date)
    estimated_valuation = Column(Numeric)  # Current estimated valuation
    revenue_estimate = Column(Numeric)  # Annual revenue if known
    employee_count = Column(Integer)  # Headcount
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    funding_rounds = relationship("FundingRound", back_populates="company", cascade="all, delete-orphan")
    investors = relationship("CompanyInvestor", back_populates="company", cascade="all, delete-orphan")
    acquisitions = relationship("AcquisitionDeal", back_populates="target_company", cascade="all, delete-orphan")
    valuations = relationship("PrivateValuation", back_populates="company", cascade="all, delete-orphan")


class FundingRound(Base):
    """Track funding rounds for private companies."""

    __tablename__ = "funding_rounds"
    __table_args__ = (
        Index("idx_company_id", "company_id"),
        Index("idx_round_type", "round_type"),
        Index("idx_announcement_date", "announcement_date"),
        UniqueConstraint("company_id", "round_type", "announcement_date", name="uq_funding_round"),
    )

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("private_companies.id"), nullable=False)
    round_type = Column(String, nullable=False)  # 'seed', 'series_a', 'series_b', 'series_c', 'series_d', 'growth', 'late_stage'
    round_number = Column(String)  # 'Series A', 'Series B2', etc.
    announcement_date = Column(Date, nullable=False)
    amount_raised = Column(Numeric, nullable=False)  # In USD
    valuation = Column(Numeric)  # Post-money valuation
    lead_investor = Column(String)  # Name of lead VC
    investors = Column(String)  # Comma-separated list of other investors
    investor_count = Column(Integer)  # Number of investors
    notes = Column(String)  # Round-specific notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("PrivateCompany", back_populates="funding_rounds")


class CompanyInvestor(Base):
    """Track which VCs/investors own stakes in private companies."""

    __tablename__ = "company_investors"
    __table_args__ = (
        Index("idx_company_id", "company_id"),
        Index("idx_investor_name", "investor_name"),
        UniqueConstraint("company_id", "investor_name", name="uq_company_investor"),
    )

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("private_companies.id"), nullable=False)
    investor_name = Column(String, nullable=False)  # VC fund name
    investor_type = Column(String)  # 'venture_capital', 'angel', 'corporate', 'private_equity', 'strategic'
    stake_percentage = Column(Numeric)  # Ownership percentage
    invested_amount = Column(Numeric)  # Total amount invested in USD
    first_investment_date = Column(Date)
    board_member = Column(Boolean, default=False)  # Is this investor on the board?
    lead_investor = Column(Boolean, default=False)  # Lead investor in rounds?
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("PrivateCompany", back_populates="investors")


class AcquisitionDeal(Base):
    """Track M&A activity - who acquired whom."""

    __tablename__ = "acquisition_deals"
    __table_args__ = (
        Index("idx_target_company_id", "target_company_id"),
        Index("idx_acquirer_name", "acquirer_name"),
        Index("idx_deal_date", "deal_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    target_company_id = Column(Integer, ForeignKey("private_companies.id"), nullable=False)
    acquirer_name = Column(String, nullable=False)  # Company that acquired
    acquirer_type = Column(String)  # 'public_company', 'private_company', 'pe_fund', 'foreign'
    deal_date = Column(Date, nullable=False)
    acquisition_price = Column(Numeric)  # Purchase price
    deal_type = Column(String)  # 'acquisition', 'merger', 'consolidation'
    status = Column(String)  # 'announced', 'completed', 'pending_regulatory'
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    target_company = relationship("PrivateCompany", back_populates="acquisitions")


class PrivateValuation(Base):
    """Track valuation history of private companies (secondary markets, investor reports)."""

    __tablename__ = "private_valuations"
    __table_args__ = (
        Index("idx_company_id", "company_id"),
        Index("idx_valuation_date", "valuation_date"),
        UniqueConstraint("company_id", "valuation_date", name="uq_private_valuation"),
    )

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("private_companies.id"), nullable=False)
    valuation_date = Column(Date, nullable=False)
    valuation = Column(Numeric, nullable=False)  # Valuation in USD
    source = Column(String)  # 'funding_round', 'secondary_market', 'estimate', 'report'
    valuation_method = Column(String)  # 'post_money', 'pre_money', 'market_price'
    valuation_vs_previous = Column(Numeric)  # Percentage change from previous
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("PrivateCompany", back_populates="valuations")


class VentureCapitalFund(Base):
    """Track VC funds themselves (for portfolio insights)."""

    __tablename__ = "venture_capital_funds"
    __table_args__ = (
        Index("idx_fund_name", "fund_name"),
        Index("idx_fund_status", "fund_status"),
    )

    id = Column(Integer, primary_key=True, index=True)
    fund_name = Column(String, nullable=False, unique=True)
    fund_type = Column(String)  # 'seed_fund', 'series_a_fund', 'growth_fund', 'multi_stage'
    founded_year = Column(Integer)
    aum = Column(Numeric)  # Assets under management in USD
    headquarters = Column(String)
    website = Column(String)
    focus_areas = Column(String)  # Comma-separated: 'AI', 'biotech', 'cleantech', 'space', etc.
    fund_status = Column(String)  # 'active', 'raising', 'closed'
    partner_count = Column(Integer)  # Number of partners/GPs
    portfolio_size = Column(Integer)  # Number of companies
    successful_exits = Column(Integer)  # Number of exits (IPO or acquisition)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class IPOPipeline(Base):
    """Track private companies expected to go public soon."""

    __tablename__ = "ipo_pipeline"
    __table_args__ = (
        Index("idx_company_id", "company_id"),
        Index("idx_expected_year", "expected_ipo_year"),
        UniqueConstraint("company_id", name="uq_ipo_pipeline"),
    )

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("private_companies.id"), nullable=False)
    expected_ipo_year = Column(Integer)
    expected_ipo_quarter = Column(String)  # 'Q1', 'Q2', 'Q3', 'Q4'
    expected_valuation = Column(Numeric)  # Expected IPO valuation
    estimated_offering_size = Column(Numeric)  # Expected proceeds
    target_exchange = Column(String)  # 'NYSE', 'NASDAQ', 'LSE', etc.
    readiness_score = Column(Integer)  # 1-10 likelihood
    confidence_level = Column(String)  # 'high', 'medium', 'low'
    underwriter = Column(String)  # Lead investment bank
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
