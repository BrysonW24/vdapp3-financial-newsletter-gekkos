# New Features Implementation Guide

This document describes the three major features added to the Gekko Finance Intelligence backend.

## Feature 1: Portfolio Tracker

### Overview
A complete portfolio management system that allows users to track their stock holdings, monitor performance, and receive relevant news.

### Components

#### Models (`app/models/portfolio.py`)
- **UserPortfolio**: Represents a user's portfolio
- **PortfolioHolding**: Individual stock holdings with cost basis
- **PortfolioSnapshot**: Daily snapshots of portfolio value and gains/losses

#### Service (`app/services/portfolio_service.py`)
- `get_current_prices()`: Fetch current prices for held symbols
- `calculate_portfolio_value()`: Calculate total portfolio value and P&L
- `create_portfolio_snapshot()`: Store daily portfolio snapshots
- `get_portfolio_performance()`: Retrieve historical performance over N days
- `get_relevant_news()`: Fetch news articles relevant to portfolio holdings

#### Router Endpoints (`app/routers/portfolio.py`)

**Portfolio Management**
- `POST /portfolio/` - Create a new portfolio
- `GET /portfolio/{user_id}` - Get all portfolios for a user
- `PUT /portfolio/{portfolio_id}` - Update portfolio details

**Holdings Management**
- `GET /portfolio/{portfolio_id}/holdings` - Get all holdings
- `POST /portfolio/{portfolio_id}/holdings` - Add a new holding
- `PUT /portfolio/{portfolio_id}/holdings/{holding_id}` - Update a holding
- `DELETE /portfolio/{portfolio_id}/holdings/{holding_id}` - Remove a holding

**Performance & Analytics**
- `GET /portfolio/{portfolio_id}/performance?days=30` - Get performance metrics
- `GET /portfolio/{portfolio_id}/news?days=7&limit=20` - Get relevant news

### Usage Example

```bash
# Create a portfolio
curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "name": "My Tech Stocks",
    "holdings": [
      {"symbol": "AAPL", "quantity": 10, "avg_buy_price": 150.00},
      {"symbol": "MSFT", "quantity": 5, "avg_buy_price": 320.00}
    ]
  }'

# Get portfolio performance
curl http://localhost:8000/portfolio/1/performance?days=30

# Get relevant news
curl http://localhost:8000/portfolio/1/news?days=7&limit=20
```

---

## Feature 2: Druckenmiller-Style Technical Analysis Charts

### Overview
Implements Stanley Druckenmiller's moving average crossover strategy across 270+ global assets including equities, forex, commodities, and bonds.

### Components

#### Models (`app/models/charts.py`)
- **ChartTimeseries**: Historical price data with calculated moving averages
- **ChartSignal**: Detected moving average crossovers (bullish/bearish)
- **ChartMetadata**: Symbol metadata and tracking information

#### Services

**Charts Service (`app/services/charts_service.py`)**
- `fetch_historical_data()`: Get historical prices from yfinance
- `store_timeseries_data()`: Store/update price data with MAs
- `get_latest_timeseries()`: Retrieve recent price data
- `initialize_tracked_symbols()`: Initialize all Druckenmiller symbols

Tracked asset classes:
- **Equities** (8 global indices): S&P 500, DAX, Nikkei, FTSE, CAC, Hang Seng, ASX 200, Bovespa
- **Forex** (6 pairs): EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CNH
- **Commodities** (6 assets): Gold, Crude Oil, Natural Gas, Corn, Wheat, Copper
- **Bonds** (3 yields): US 10Y, 30Y, 5Y Treasury yields

**Signals Service (`app/services/signals_service.py`)**
- `calculate_moving_average()`: Compute simple MAs (8-period, 20-period)
- `update_moving_averages()`: Update all MA values for a symbol
- `detect_crossovers()`: Identify bullish/bearish crosses
- `get_recent_signals()`: Retrieve recent signals with filters
- `get_bullish_signals()`: Get all bullish crosses from past N days

**PDF Charts Service (`app/services/pdf_charts_service.py`)**
- `generate_druckenmiller_report()`: Generate comprehensive PDF report
- `generate_signal_summary_table()`: Create summary statistics

### API Endpoints (Future Implementation)
```
GET /charts/signals?days=7&signal_type=bullish_cross
GET /charts/timeseries/{symbol}?limit=100
GET /charts/metadata
POST /charts/generate-report
GET /charts/pdf/{date}
```

### Usage Example (Service Level)

```python
from app.services.charts_service import ChartsService
from app.services.signals_service import SignalsService

# Initialize services
charts_svc = ChartsService(db_session)
signals_svc = SignalsService(db_session)

# Fetch and store historical data
data = await charts_svc.fetch_historical_data(
    symbol="^GSPC",  # S&P 500
    start_date=date(2024, 1, 1),
    end_date=date.today(),
    asset_class="equity"
)

charts_svc.store_timeseries_data(
    symbol="^GSPC",
    asset_class="equity",
    data=data
)

# Calculate moving averages
signals_svc.update_moving_averages("^GSPC")

# Detect crossovers
signal = signals_svc.detect_crossovers(
    symbol="^GSPC",
    timeframe="daily",
    target_date=date.today()
)

# Get all bullish signals from past 7 days
bullish = signals_svc.get_bullish_signals(days=7, asset_class="equity")

# Generate PDF report
from app.services.pdf_charts_service import PDFChartsService
pdf_svc = PDFChartsService(db_session)
pdf_bytes = pdf_svc.generate_druckenmiller_report(target_date=date.today())
```

### Database Schema
```sql
-- Price data with moving averages
CREATE TABLE chart_timeseries (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    asset_class VARCHAR NOT NULL,
    date DATE NOT NULL,
    close_price NUMERIC NOT NULL,
    ma_8 NUMERIC,           -- 8-period moving average
    ma_20 NUMERIC,          -- 20-period moving average
    UNIQUE(symbol, date)
);

-- Detected signals
CREATE TABLE chart_signals (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR NOT NULL,
    timeframe VARCHAR NOT NULL,  -- 'daily', 'weekly', 'monthly'
    signal_date DATE NOT NULL,
    signal_type VARCHAR NOT NULL,  -- 'bullish_cross', 'bearish_cross'
    ma_short NUMERIC,
    ma_long NUMERIC,
    UNIQUE(symbol, timeframe, signal_date)
);
```

---

## Feature 3: YouTube → PDF Summarizer

### Overview
Extracts YouTube video transcripts, uses LLMs to generate summaries with bullet points or timestamped key takeaways, and exports as PDF.

### Components

#### Service: YouTube (`app/services/youtube_service.py`)
- `extract_video_id()`: Parse various YouTube URL formats
- `get_transcript()`: Fetch transcript using youtube-transcript-api
- `chunk_transcript()`: Split text into LLM-compatible chunks (max 8000 tokens)
- `format_transcript_chunk()`: Prepare text for LLM processing
- `format_transcript_with_timestamps()`: Add timestamps to transcript
- `extract_key_segments()`: Filter segments by keywords
- `validate_url()`: Verify YouTube URL validity

#### Service: LLM (`app/services/llm_service.py`)
Supports both Anthropic (Claude) and OpenAI (GPT-4) APIs.

**Methods:**
- `summarize_transcript()`: Generate bullet points or paragraph summaries
- `extract_timestamps_and_points()`: Create timestamped key takeaways
- `generate_newsletter_section()`: Create newsletter-ready content

#### Router (`app/routers/youtube.py`)

**Endpoints:**
- `POST /youtube/summarize` - Submit YouTube URL for summarization
- `GET /youtube/status/{video_id}` - Check processing status
- `GET /youtube/results/{video_id}` - Retrieve completed summary
- `POST /youtube/extract-timestamps` - Extract timestamped key points

### Background Task Processing

Jobs are tracked in-memory (in production, use Redis/database):

```python
processing_jobs[video_id] = {
    "status": "processing|completed|error",
    "summary_count": 5,
    "summaries": ["Key point 1", "Key point 2", ...],
    "message": "Error message if failed"
}
```

### Usage Example

#### 1. Submit for Summarization
```bash
curl -X POST http://localhost:8000/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "llm_provider": "anthropic",
    "format": "bullet_points"
  }'
```

Response:
```json
{
  "status": "processing",
  "video_id": "dQw4w9WgXcQ",
  "message": "Transcript is being processed. Check back soon."
}
```

#### 2. Check Status
```bash
curl http://localhost:8000/youtube/status/dQw4w9WgXcQ
```

Response:
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "completed",
  "summary_count": 12,
  "summaries": [
    "First key point discussed...",
    "Second important takeaway...",
    ...
  ]
}
```

#### 3. Get Results
```bash
curl http://localhost:8000/youtube/results/dQw4w9WgXcQ
```

### Transcript Chunking Logic

Videos are automatically chunked based on token limits:

```
Document: 50,000 tokens → 7 chunks of ~8,000 tokens each
Each chunk is separately summarized
Final output combines all summaries
```

### LLM Prompts

**Bullet Points Format:**
```
Extract the key points from this transcript as concise bullet points.
Focus on actionable insights, important facts, and main arguments.
```

**Paragraph Format:**
```
Summarize this transcript into 2-3 clear paragraphs.
Focus on the main themes and important takeaways.
```

**Timestamped Format:**
```
[00:15] First key topic discussed
[02:45] Important insight about market trends
[05:30] Actionable recommendation
```

---

## Database Migrations

Run migrations to create tables:

```bash
# Apply migrations
psql $DATABASE_URL < migrations/001_create_chart_tables.sql

# Create portfolio snapshots table (already in models)
alembic upgrade head
```

## Configuration

Add to `.env`:

```env
# YouTube & LLM Processing
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Portfolio Price Fetching
ALPHA_VANTAGE_API_KEY=...
FINAGE_API_KEY=...

# Background Job Processing
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379
```

## Background Jobs (Future Implementation)

### Daily Portfolio Snapshots
```python
@scheduler.scheduled_job('cron', hour=16, minute=30)  # Market close
async def daily_portfolio_snapshot():
    portfolios = db.query(UserPortfolio).all()
    for portfolio in portfolios:
        service = PortfolioService(db)
        current_prices = await service.get_current_prices(
            [h.symbol for h in portfolio.holdings]
        )
        total_value, total_gain_loss = await service.calculate_portfolio_value(
            portfolio.id, current_prices
        )
        service.create_portfolio_snapshot(
            portfolio.id, date.today(), total_value, total_gain_loss
        )
```

### Daily Druckenmiller Charts
```python
@scheduler.scheduled_job('cron', hour=17)  # After US market close
async def daily_druckenmiller_charts():
    charts_svc = ChartsService(db)
    signals_svc = SignalsService(db)

    # Update all 270+ symbols
    for asset_class, symbols in DRUCKENMILLER_SYMBOLS.items():
        for symbol in symbols:
            data = await charts_svc.fetch_historical_data(
                symbol, date.today() - timedelta(days=200), date.today()
            )
            charts_svc.store_timeseries_data(symbol, asset_class, data)
            signals_svc.update_moving_averages(symbol)
            signals_svc.detect_crossovers(symbol)

    # Generate PDF report
    pdf_svc = PDFChartsService(db)
    pdf = pdf_svc.generate_druckenmiller_report(date.today())
    # Store PDF to S3 or file system
```

---

## Testing

```python
# Test portfolio creation
def test_create_portfolio(client, db):
    response = client.post("/portfolio/", json={
        "user_id": "test_user",
        "name": "Test Portfolio",
        "holdings": [
            {"symbol": "AAPL", "quantity": 10, "avg_buy_price": 150}
        ]
    })
    assert response.status_code == 200
    assert response.json()["id"] > 0

# Test YouTube summarization
def test_youtube_summarize(client):
    response = client.post("/youtube/summarize", json={
        "url": "https://youtube.com/watch?v=test",
        "llm_provider": "anthropic"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "processing"
```

---

## Performance Considerations

1. **Portfolio Snapshots**: Create daily snapshots to reduce real-time calculation overhead
2. **Moving Averages**: Pre-calculate and cache MA values in the database
3. **YouTube Processing**: Use background tasks to prevent blocking API requests
4. **Chart Generation**: Cache PDF reports and regenerate daily
5. **API Calls**: Implement rate limiting and caching for external API calls

---

## Future Enhancements

1. **Real-time Updates**: Use WebSockets for live portfolio updates
2. **Advanced Analytics**: Add Bollinger Bands, RSI, MACD indicators
3. **Risk Assessment**: Implement Value-at-Risk (VaR) calculations
4. **Portfolio Optimization**: Suggest asset allocation changes
5. **Social Features**: Share portfolio performance with other users
6. **Mobile App**: Native iOS/Android apps for portfolio tracking
7. **Alerts**: Push notifications for price movements and news
8. **Machine Learning**: Predict price movements and optimal entry/exit points
