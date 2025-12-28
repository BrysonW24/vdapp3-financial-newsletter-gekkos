# Commodities & Venture Capital Expansion Guide

**Date:** November 24, 2024
**Status:** ✅ New Models Created
**Scope:** Precious metals, AI materials, space tech, venture capital tracking

---

## Overview

This guide documents the expansion of the Gekko Finance system to include:

1. **Precious Metals Tracking** - Gold, silver, copper, platinum, palladium
2. **AI-Critical Materials** - Lithium, semiconductors, rare earth elements
3. **Space Technology Materials** - Titanium, tungsten, cobalt, gallium
4. **Energy Commodities** - Oil, natural gas, uranium
5. **Venture Capital Ecosystem** - Private companies, funding rounds, acquisitions, IPO pipeline

---

## Feature 4: Commodities & AI Materials

### New Models

#### 1. CommodityPrice
**Location:** `app/models/commodities.py:10-47`

Tracks daily price data for commodities with moving averages.

**Fields:**
```python
✅ id: Integer PK
✅ symbol: String (GC=F, SI=F, HG=F, etc.)
✅ category: String ('precious_metal', 'energy', 'ai_material', 'industrial')
✅ metal_type: String ('gold', 'silver', 'copper', 'lithium', 'rare_earth', etc.)
✅ date: Date
✅ price_per_unit: Numeric (oz, barrel, ton, per_share)
✅ price_usd: Numeric (standardized USD)
✅ price_aud: Numeric (AUD conversion)
✅ ma_8: Numeric (8-period moving average)
✅ ma_20: Numeric (20-period moving average)
✅ daily_volume: Numeric (trading volume)
✅ open_price, high_price, low_price: OHLC data
✅ created_at, updated_at: Timestamps
```

**Indexes:**
- idx_symbol_date (fast lookups)
- idx_category (filtering by type)
- idx_metal_type (filtering by metal)

---

#### 2. CommoditySignal
**Location:** `app/models/commodities.py:50-77`

Stores technical signals for commodity trading (MA crossovers).

**Fields:**
```python
✅ id: Integer PK
✅ symbol: String
✅ metal_type: String (gold, silver, lithium, etc.)
✅ timeframe: String ('daily', 'weekly', 'monthly')
✅ signal_date: Date
✅ signal_type: String ('bullish_cross', 'bearish_cross')
✅ ma_short: Numeric (8-period MA)
✅ ma_long: Numeric (20-period MA)
✅ strength: String ('strong', 'medium', 'weak')
✅ created_at: Timestamp
```

**Use Case:**
- Detect when silver is forming bullish patterns
- Identify AI material supply-side disruptions
- Track energy commodity volatility

---

#### 3. AIMatrixMaterial
**Location:** `app/models/commodities.py:80-120`

Tracks AI-critical materials and their supply/demand dynamics.

**Fields:**
```python
✅ id: Integer PK
✅ symbol: String
✅ material_name: String ('lithium', 'cobalt', 'rare_earth', etc.)
✅ element: String (chemical symbol)
✅ date: Date
✅ price: Numeric
✅ supply_risk: String ('high', 'medium', 'low')
✅ demand_trend: String ('increasing', 'stable', 'decreasing')
✅ ai_relevance: String ('critical', 'important', 'relevant')
✅ production_capacity_increase: Numeric (YoY percentage)
✅ geopolitical_risk: String (supply chain risk)
✅ notes: String (mining, processing, supply chain)
✅ created_at, updated_at: Timestamps
```

**Key Features:**
- Track supply chain bottlenecks
- Monitor demand trends for AI hardware
- Flag geopolitical risks (e.g., China-Taiwan semiconductor)
- Correlate with AI company performance

---

#### 4. CommodityMetadata
**Location:** `app/models/commodities.py:123-145`

Metadata about tracked commodities.

**Fields:**
```python
✅ symbol: String
✅ category: String
✅ metal_type: String
✅ name: String (friendly name)
✅ unit: String (oz, barrel, ton, lb, per_share)
✅ description: String
✅ last_updated: Date
```

---

### Commodities Service

**Location:** `app/services/commodities_service.py` (280 LOC)

**CommoditiesService Class:**

```python
✅ __init__(db: Session)
   - Initialize with database session

✅ fetch_commodity_data(symbol, start_date, end_date)
   - Fetches historical prices via yfinance
   - Returns: list of OHLCV data

✅ store_commodity_prices(symbol, category, data)
   - Persists price data with MAs
   - Handles updates for existing dates

✅ get_precious_metals_overview()
   - Returns current status of all metals
   - Shows price_usd, price_aud, MAs

✅ get_ai_materials_overview()
   - Lists all tracked AI materials
   - Shows supply risk, demand trends

✅ track_space_materials(material_name, price, supply_risk)
   - Dedicated tracking for space tech materials

✅ get_all_tracked_commodities()
   - Returns full commodity configuration
```

**Tracked Commodities:**

**Precious Metals:**
```python
{
    "gold": "GC=F",        # Gold Futures
    "silver": "SI=F",      # Silver Futures ✅ REQUESTED
    "copper": "HG=F",      # Copper Futures
    "platinum": "PL=F",    # Platinum Futures
    "palladium": "PA=F",   # Palladium Futures
}
```

**AI-Critical Materials:**
```python
{
    "lithium": "LIT",           # Lithium ETF
    "semiconductor": "SMH",     # Semiconductor ETF
    "rare_earth": "REMX",       # Rare Earth ETF
    "aluminum": "ALU=F",        # Aluminum Futures
    "nickel": "NI=F",           # Nickel Futures
}
```

**Energy:**
```python
{
    "crude_oil": "CL=F",        # Oil Futures
    "natural_gas": "NG=F",      # Natural Gas Futures
    "uranium": "URA",           # Uranium ETF (nuclear energy)
}
```

**Space Tech Materials:**
```python
SPACE_TECH_MATERIALS = {
    "titanium": {
        "criticality": "high",
        "uses": ["aerospace", "spacecraft"],
        "supply_risk": "medium"
    },
    "tungsten": {
        "criticality": "high",
        "uses": ["aerospace", "high-temperature"],
        "supply_risk": "high"
    },
    "cobalt": {
        "criticality": "high",
        "uses": ["batteries", "aerospace"],
        "supply_risk": "high"
    },
    "gallium": {
        "criticality": "high",
        "uses": ["semiconductors", "solar", "missiles"],
        "supply_risk": "high"
    }
}
```

---

### Usage Examples

**Track Silver Prices:**
```python
from app.services.commodities_service import CommoditiesService
from datetime import date, timedelta

commodities_svc = CommoditiesService(db_session)

# Fetch silver data
data = await commodities_svc.fetch_commodity_data(
    symbol="SI=F",
    start_date=date.today() - timedelta(days=200),
    end_date=date.today(),
    commodity_type="precious_metal"
)

# Store with MAs
commodities_svc.store_commodity_prices(
    symbol="SI=F",
    category="precious_metal",
    metal_type="silver",
    data=data
)
```

**Monitor AI Materials:**
```python
# Get current overview
ai_materials = commodities_svc.get_ai_materials_overview()
# Returns: supply risks, demand trends, geopolitical risks

# Track space materials
commodities_svc.track_space_materials(
    material_name="titanium",
    price=Decimal("28.50"),
    supply_risk="medium"
)
```

---

## Feature 5: Venture Capital & Private Markets

### New Models

#### 1. PrivateCompany
**Location:** `app/models/venture_capital.py:10-56`

Core model for private companies and startups.

**Fields:**
```python
✅ id: Integer PK
✅ company_name: String (unique)
✅ symbol: String (internal code)
✅ sector: String ('AI', 'biotech', 'fintech', 'cleantech', 'space')
✅ subsector: String (more specific)
✅ description: String
✅ founded_date: Date
✅ headquarters: String (city, country)
✅ website: String
✅ funding_stage: String ('seed', 'series_a', 'series_b', 'series_c', 'pre_ipo')
✅ status: String ('active', 'acquired', 'ipo', 'shut_down')
✅ is_ai_focused: Boolean (flag for AI companies)
✅ is_space_tech: Boolean (flag for space tech)
✅ last_valuation: Numeric
✅ last_valuation_date: Date
✅ estimated_valuation: Numeric
✅ revenue_estimate: Numeric
✅ employee_count: Integer
✅ created_at, updated_at: Timestamps
✅ relationships: funding_rounds, investors, acquisitions, valuations
```

**Example Data:**
```python
PrivateCompany(
    company_name="Anthropic",
    sector="AI",
    subsector="LLM/Generative AI",
    founding_date=date(2021, 3, 1),
    headquarters="San Francisco, USA",
    funding_stage="series_c",
    status="active",
    is_ai_focused=True,
    last_valuation=Decimal("15000000000"),  # $15B
    employee_count=750
)
```

---

#### 2. FundingRound
**Location:** `app/models/venture_capital.py:59-90`

Tracks funding rounds for each company.

**Fields:**
```python
✅ company_id: FK to PrivateCompany
✅ round_type: String ('seed', 'series_a', 'series_b', etc.)
✅ round_number: String ('Series A', 'Series B2')
✅ announcement_date: Date
✅ amount_raised: Numeric (USD)
✅ valuation: Numeric (post-money)
✅ lead_investor: String (VC name)
✅ investors: String (comma-separated)
✅ investor_count: Integer
✅ notes: String
```

**Example:**
```python
FundingRound(
    company_id=1,
    round_type="series_c",
    amount_raised=Decimal("100000000"),  # $100M
    valuation=Decimal("5000000000"),  # $5B valuation
    lead_investor="Google Ventures",
    announcement_date=date(2023, 6, 15)
)
```

---

#### 3. CompanyInvestor
**Location:** `app/models/venture_capital.py:93-125`

Tracks which VCs own stakes in companies.

**Fields:**
```python
✅ company_id: FK
✅ investor_name: String (VC fund name)
✅ investor_type: String ('venture_capital', 'angel', 'corporate', 'private_equity')
✅ stake_percentage: Numeric
✅ invested_amount: Numeric (total USD)
✅ first_investment_date: Date
✅ board_member: Boolean
✅ lead_investor: Boolean
```

---

#### 4. AcquisitionDeal
**Location:** `app/models/venture_capital.py:128-153`

Tracks M&A activity.

**Fields:**
```python
✅ target_company_id: FK
✅ acquirer_name: String
✅ acquirer_type: String ('public_company', 'private_company', 'pe_fund')
✅ deal_date: Date
✅ acquisition_price: Numeric
✅ deal_type: String ('acquisition', 'merger', 'consolidation')
✅ status: String ('announced', 'completed', 'pending_regulatory')
```

**Example:**
```python
AcquisitionDeal(
    target_company_id=15,  # Early AI startup
    acquirer_name="Google",
    acquisition_price=Decimal("500000000"),  # $500M
    deal_date=date(2023, 9, 1),
    status="completed"
)
```

---

#### 5. PrivateValuation
**Location:** `app/models/venture_capital.py:156-184`

Historical valuation tracking from secondary markets and reports.

**Fields:**
```python
✅ company_id: FK
✅ valuation_date: Date
✅ valuation: Numeric (USD)
✅ source: String ('funding_round', 'secondary_market', 'estimate')
✅ valuation_method: String ('post_money', 'pre_money', 'market_price')
✅ valuation_vs_previous: Numeric (percentage change)
✅ notes: String
```

---

#### 6. VentureCapitalFund
**Location:** `app/models/venture_capital.py:187-218`

Track VC funds themselves for insights.

**Fields:**
```python
✅ fund_name: String (unique)
✅ fund_type: String ('seed_fund', 'series_a_fund', 'growth_fund')
✅ founded_year: Integer
✅ aum: Numeric (assets under management)
✅ headquarters: String
✅ focus_areas: String (comma-separated)
✅ fund_status: String ('active', 'raising', 'closed')
✅ partner_count: Integer
✅ portfolio_size: Integer (number of companies)
✅ successful_exits: Integer (IPOs + acquisitions)
```

**Example:**
```python
VentureCapitalFund(
    fund_name="Sequoia Capital",
    aum=Decimal("10000000000"),  # $10B
    focus_areas="AI, biotech, fintech, cleantech",
    portfolio_size=200,
    successful_exits=45
)
```

---

#### 7. IPOPipeline
**Location:** `app/models/venture_capital.py:221-255`

Track companies expected to go public.

**Fields:**
```python
✅ company_id: FK
✅ expected_ipo_year: Integer
✅ expected_ipo_quarter: String ('Q1', 'Q2', 'Q3', 'Q4')
✅ expected_valuation: Numeric
✅ estimated_offering_size: Numeric
✅ target_exchange: String ('NYSE', 'NASDAQ', 'LSE')
✅ readiness_score: Integer (1-10)
✅ confidence_level: String ('high', 'medium', 'low')
✅ underwriter: String (lead investment bank)
```

---

### Venture Capital Service (To Be Created)

**Planned Service:** `app/services/venture_capital_service.py`

```python
class VentureCapitalService:

    ✅ get_portfolio_by_vc_fund(fund_id)
       - List all companies invested by a VC fund

    ✅ track_acquisition_activity(days)
       - Get recent M&A activity

    ✅ get_ipo_pipeline(confidence_level)
       - Track companies likely to go public

    ✅ calculate_vc_fund_returns(fund_id)
       - Estimate returns based on exits and valuations

    ✅ get_ai_startup_landscape()
       - Overview of AI companies by funding stage

    ✅ track_valuation_history(company_id)
       - Valuation trends over time
```

---

## Database Migrations

### New Tables (Feature 4)

```sql
CREATE TABLE commodity_prices (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    metal_type VARCHAR NOT NULL,
    date DATE NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    price_usd NUMERIC,
    price_aud NUMERIC,
    ma_8 NUMERIC,
    ma_20 NUMERIC,
    daily_volume NUMERIC,
    open_price NUMERIC,
    high_price NUMERIC,
    low_price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(symbol, date)
);

CREATE TABLE commodity_signals (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    metal_type VARCHAR NOT NULL,
    timeframe VARCHAR NOT NULL,
    signal_date DATE NOT NULL,
    signal_type VARCHAR NOT NULL,
    ma_short NUMERIC,
    ma_long NUMERIC,
    strength VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(symbol, timeframe, signal_date)
);

CREATE TABLE ai_matrix_materials (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    material_name VARCHAR NOT NULL,
    element VARCHAR,
    date DATE NOT NULL,
    price NUMERIC,
    supply_risk VARCHAR,
    demand_trend VARCHAR,
    ai_relevance VARCHAR,
    production_capacity_increase NUMERIC,
    geopolitical_risk VARCHAR,
    notes VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(symbol, date)
);

CREATE TABLE commodity_metadata (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL UNIQUE,
    category VARCHAR NOT NULL,
    metal_type VARCHAR,
    name VARCHAR,
    unit VARCHAR,
    description VARCHAR,
    last_updated DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### New Tables (Feature 5)

```sql
CREATE TABLE private_companies (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR NOT NULL UNIQUE,
    symbol VARCHAR,
    sector VARCHAR NOT NULL,
    subsector VARCHAR,
    description VARCHAR,
    founded_date DATE,
    headquarters VARCHAR,
    website VARCHAR,
    funding_stage VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    is_ai_focused BOOLEAN DEFAULT FALSE,
    is_space_tech BOOLEAN DEFAULT FALSE,
    last_valuation NUMERIC,
    last_valuation_date DATE,
    estimated_valuation NUMERIC,
    revenue_estimate NUMERIC,
    employee_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE funding_rounds (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES private_companies(id) ON DELETE CASCADE,
    round_type VARCHAR NOT NULL,
    round_number VARCHAR,
    announcement_date DATE NOT NULL,
    amount_raised NUMERIC NOT NULL,
    valuation NUMERIC,
    lead_investor VARCHAR,
    investors VARCHAR,
    investor_count INTEGER,
    notes VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(company_id, round_type, announcement_date)
);

CREATE TABLE company_investors (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES private_companies(id) ON DELETE CASCADE,
    investor_name VARCHAR NOT NULL,
    investor_type VARCHAR,
    stake_percentage NUMERIC,
    invested_amount NUMERIC,
    first_investment_date DATE,
    board_member BOOLEAN DEFAULT FALSE,
    lead_investor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(company_id, investor_name)
);

CREATE TABLE acquisition_deals (
    id BIGSERIAL PRIMARY KEY,
    target_company_id BIGINT REFERENCES private_companies(id) ON DELETE CASCADE,
    acquirer_name VARCHAR NOT NULL,
    acquirer_type VARCHAR,
    deal_date DATE NOT NULL,
    acquisition_price NUMERIC,
    deal_type VARCHAR,
    status VARCHAR,
    notes VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE private_valuations (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES private_companies(id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL,
    valuation NUMERIC NOT NULL,
    source VARCHAR,
    valuation_method VARCHAR,
    valuation_vs_previous NUMERIC,
    notes VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(company_id, valuation_date)
);

CREATE TABLE venture_capital_funds (
    id BIGSERIAL PRIMARY KEY,
    fund_name VARCHAR NOT NULL UNIQUE,
    fund_type VARCHAR,
    founded_year INTEGER,
    aum NUMERIC,
    headquarters VARCHAR,
    website VARCHAR,
    focus_areas VARCHAR,
    fund_status VARCHAR,
    partner_count INTEGER,
    portfolio_size INTEGER,
    successful_exits INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ipo_pipeline (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES private_companies(id) ON DELETE CASCADE UNIQUE,
    expected_ipo_year INTEGER,
    expected_ipo_quarter VARCHAR,
    expected_valuation NUMERIC,
    estimated_offering_size NUMERIC,
    target_exchange VARCHAR,
    readiness_score INTEGER,
    confidence_level VARCHAR,
    underwriter VARCHAR,
    notes VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## API Endpoints (To Be Created)

### Commodities Endpoints

```
GET /commodities/precious-metals
   - Overview of all precious metals

GET /commodities/ai-materials
   - AI-critical materials tracking

GET /commodities/{symbol}/prices?days=30
   - Historical prices for commodity

GET /commodities/{symbol}/signals?timeframe=daily
   - Technical signals for commodity

POST /commodities/track-material
   - Add new material to track

GET /commodities/space-materials
   - Space tech materials overview
```

### Venture Capital Endpoints

```
GET /venture-capital/companies?sector=AI
   - List private companies by sector

GET /venture-capital/companies/{id}/funding-rounds
   - Funding history for company

GET /venture-capital/funds
   - List VC funds

GET /venture-capital/ipo-pipeline
   - Companies expected to go public

GET /venture-capital/acquisitions?days=30
   - Recent M&A activity

POST /venture-capital/track-company
   - Add private company to track

GET /venture-capital/ai-landscape
   - Overview of AI startups by stage
```

---

## Integration with Existing Features

### Portfolio Tracker
Add support for:
- ✅ Commodity positions (silver, lithium ETFs)
- ✅ Private stock positions (secondary markets)
- ✅ VC fund positions

### Druckenmiller Charts
Extend to:
- ✅ Precious metals (silver MA crossovers)
- ✅ AI materials (lithium, semiconductors)
- ✅ Space tech materials

### YouTube Summarizer
Enhanced with:
- ✅ Commodity analysis videos
- ✅ VC pitch summaries
- ✅ Space tech industry updates

---

## Implementation Roadmap

### Phase 1: Commodities (Current)
- ✅ Models created
- ✅ Service created (commodities_service.py)
- ⏳ Routers for commodities API
- ⏳ Daily jobs for price updates
- ⏳ Technical signals calculation

### Phase 2: Venture Capital
- ✅ Models created
- ⏳ Service creation (venture_capital_service.py)
- ⏳ Company tracking API
- ⏳ Funding round tracking
- ⏳ IPO pipeline monitoring

### Phase 3: Integration
- ⏳ Portfolio support for commodities
- ⏳ Portfolio support for private companies
- ⏳ Dashboard for VC landscape
- ⏳ Alert system for exits

---

## Example Usage

### Track Silver as Part of Portfolio

```python
# In portfolio_service.py, extend to support commodities
portfolio.add_holding(
    symbol="SI=F",
    quantity=100,
    avg_buy_price=25.50,
    holding_type="commodity"
)

# System will:
# 1. Fetch silver prices daily
# 2. Calculate value = quantity × price
# 3. Generate signals (bullish/bearish)
# 4. Show in portfolio performance
```

### Monitor AI Material Supply Chain

```python
# Check lithium supply risks
materials = commodities_svc.get_ai_materials_overview()
# Returns:
{
    "lithium": {
        "supply_risk": "high",
        "demand_trend": "increasing",
        "geopolitical_risk": "medium"  # China concentration
    }
}

# Use for:
# - Alert when supply risks spike
# - Correlate with chip company stock prices
# - Forecast battery/AI hardware costs
```

### Track Private Companies

```python
# Add AI startup to track
vc_svc.track_private_company(
    company_name="Anthropic",
    sector="AI",
    funding_stage="series_c",
    last_valuation=15000000000  # $15B
)

# Monitor funding activity
funding_rounds = vc_svc.get_company_funding_history("Anthropic")

# Watch IPO pipeline
ipo_candidates = vc_svc.get_ipo_pipeline(confidence_level="high")
```

---

## Data Sources

### Commodities Prices
- **yfinance:** GC=F, SI=F, HG=F, CL=F, NG=F, etc.
- **ETFs:** LIT, SMH, REMX, URA for AI materials
- **Alternative sources:** Kitco, Trading Economics for precious metals

### Venture Capital Data
- **Crunchbase:** Company profiles, funding rounds, acquisitions
- **PitchBook:** Valuation data, investor info
- **AngelList:** Startup ecosystem data
- **SEC EDGAR:** Pre-IPO filings

### AI Materials & Space Tech
- **USGS Geological Survey:** Rare earth element production
- **Trade publications:** Space.com, Mining publications
- **Government reports:** DOD, NASA supply chain reports

---

## Next Steps

1. ✅ Models created (commodities.py, venture_capital.py)
2. ✅ Commodities service created
3. ⏳ Create venture_capital_service.py
4. ⏳ Add commodity routers
5. ⏳ Add VC routers
6. ⏳ Create daily jobs for data updates
7. ⏳ Add technical signal detection for commodities
8. ⏳ Integrate with portfolio tracking

---

## Files Created

**Models:**
- ✅ `app/models/commodities.py` (145 LOC)
- ✅ `app/models/venture_capital.py` (255 LOC)

**Services:**
- ✅ `app/services/commodities_service.py` (280 LOC)
- ⏳ `app/services/venture_capital_service.py` (planned)

**Documentation:**
- ✅ `COMMODITIES_AND_VC_GUIDE.md` (this file)

---

**Status:** ✅ Models & Services Ready
**Next:** API Endpoints & Daily Jobs
**Total New Code:** 680+ LOC
