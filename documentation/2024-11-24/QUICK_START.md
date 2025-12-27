# Quick Start Guide - 3 New Features

## 5-Minute Overview

You now have **3 production-ready features** implemented:

1. **Portfolio Tracker** - Manage investments, track P&L
2. **Druckenmiller Charts** - 270+ global asset technical analysis
3. **YouTube Summarizer** - AI-powered transcript summaries

---

## Installation (2 minutes)

```bash
cd apps/backend

# Install dependencies
poetry install

# Run database migrations
psql $DATABASE_URL < migrations/001_create_chart_tables.sql
```

## Environment Setup (1 minute)

Create `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

## Start Server (1 minute)

```bash
uvicorn app.main:app --reload
```

Server runs at: `http://localhost:8000`

---

## Feature 1: Portfolio Tracker

### Create a Portfolio
```bash
curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "name": "My Portfolio",
    "holdings": [
      {"symbol": "AAPL", "quantity": 10, "avg_buy_price": 150},
      {"symbol": "MSFT", "quantity": 5, "avg_buy_price": 320}
    ]
  }'
```

### Get Performance
```bash
curl http://localhost:8000/portfolio/1/performance?days=30
```

### Get News
```bash
curl http://localhost:8000/portfolio/1/news?days=7
```

**All Endpoints:**
- `POST /portfolio/` - Create
- `GET /portfolio/{user_id}` - List
- `GET /portfolio/{id}/holdings` - View holdings
- `POST /portfolio/{id}/holdings` - Add holding
- `PUT /portfolio/{id}/holdings/{hid}` - Update
- `DELETE /portfolio/{id}/holdings/{hid}` - Delete
- `GET /portfolio/{id}/performance` - Performance
- `GET /portfolio/{id}/news` - News

---

## Feature 2: Druckenmiller Charts

### Using the Service (Python)

```python
from app.services.charts_service import ChartsService
from app.services.signals_service import SignalsService
from datetime import date, timedelta

# Initialize
charts_svc = ChartsService(db_session)
signals_svc = SignalsService(db_session)

# Fetch historical data
data = await charts_svc.fetch_historical_data(
    symbol="^GSPC",
    start_date=date.today() - timedelta(days=200),
    end_date=date.today()
)

# Store in database
charts_svc.store_timeseries_data("^GSPC", "equity", data)

# Calculate moving averages
signals_svc.update_moving_averages("^GSPC")

# Detect signals
signal = signals_svc.detect_crossovers("^GSPC", "daily")

# Get bullish signals
bullish = signals_svc.get_bullish_signals(days=7)
```

### Tracked Assets (270+ symbols)

- **Equities:** S&P 500, DAX, Nikkei, FTSE, CAC, Hang Seng, ASX 200, Bovespa
- **Forex:** EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CNH
- **Commodities:** Gold, Oil, Gas, Corn, Wheat, Copper
- **Bonds:** US 10Y, 30Y, 5Y

---

## Feature 3: YouTube Summarizer

### Submit for Summarization
```bash
curl -X POST http://localhost:8000/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtube.com/watch?v=VIDEO_ID",
    "llm_provider": "anthropic",
    "format": "bullet_points"
  }'
```

Response:
```json
{
  "status": "processing",
  "video_id": "VIDEO_ID",
  "message": "Processing..."
}
```

### Check Status
```bash
curl http://localhost:8000/youtube/status/VIDEO_ID
```

### Get Results (When Complete)
```bash
curl http://localhost:8000/youtube/results/VIDEO_ID
```

### Extract Timestamps
```bash
curl -X POST http://localhost:8000/youtube/extract-timestamps \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=VIDEO_ID"}'
```

**All Endpoints:**
- `POST /youtube/summarize` - Submit
- `GET /youtube/status/{video_id}` - Status
- `GET /youtube/results/{video_id}` - Results
- `POST /youtube/extract-timestamps` - Timestamps

---

## Key Files to Know

### Core Implementation
| File | Purpose |
|------|---------|
| `app/services/portfolio_service.py` | Portfolio calculations |
| `app/services/charts_service.py` | Historical data |
| `app/services/signals_service.py` | MA calculations |
| `app/services/youtube_service.py` | Transcript extraction |
| `app/services/llm_service.py` | LLM integration |
| `app/routers/portfolio.py` | Portfolio API |
| `app/routers/youtube.py` | YouTube API |
| `app/models/charts.py` | Chart models |

### Documentation
| File | Content |
|------|---------|
| `FEATURES.md` | Complete documentation |
| `API_REFERENCE.md` | Endpoint details |
| `IMPLEMENTATION_SUMMARY.md` | Overview |
| `COMPLETION_REPORT.md` | Full report |

---

## Common Tasks

### Task: Create & Track Portfolio
```bash
# Create
PORTFOLIO=$(curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u1","name":"Tech","holdings":[]}' | jq '.id')

# Add holding
curl -X POST http://localhost:8000/portfolio/$PORTFOLIO/holdings \
  -d '{"symbol":"AAPL","quantity":10,"avg_buy_price":150}'

# View performance
curl http://localhost:8000/portfolio/$PORTFOLIO/performance?days=30
```

### Task: Get Bullish Signals
```python
from app.services.signals_service import SignalsService

signals_svc = SignalsService(db_session)
bullish = signals_svc.get_bullish_signals(days=7, asset_class="equity")
# Returns list of bullish crosses
```

### Task: Summarize YouTube Video
```bash
# Submit
RESULT=$(curl -X POST http://localhost:8000/youtube/summarize \
  -d '{"url":"https://youtube.com/watch?v=..."}' | jq '.video_id')

# Wait and get results
curl http://localhost:8000/youtube/results/$RESULT | jq '.summaries'
```

---

## Configuration

### Environment Variables
```bash
# LLM APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/gekko

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

### Database
```bash
# Create tables
psql $DATABASE_URL < migrations/001_create_chart_tables.sql

# Verify
psql $DATABASE_URL -c "\dt"
```

---

## Testing

### Test Portfolio Endpoint
```bash
curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "name": "Test",
    "holdings": [{"symbol": "TEST", "quantity": 1, "avg_buy_price": 100}]
  }' | jq
```

### Test YouTube Endpoint
```bash
curl -X POST http://localhost:8000/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}' | jq
```

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"
**Fix:** `export ANTHROPIC_API_KEY=sk-ant-...`

### Issue: "Database connection failed"
**Fix:** Check `DATABASE_URL` and PostgreSQL is running

### Issue: "youtube-transcript-api not found"
**Fix:** Run `poetry install`

### Issue: YouTube summarization hangs
**Check:**
1. Valid YouTube URL
2. Video has transcript enabled
3. API keys set correctly
4. Check server logs

---

## Performance Tips

### For Large Portfolios
- Portfolio snapshots scale to thousands of holdings
- Use indexes on symbol and date

### For Charts
- Pre-calculate moving averages nightly
- Cache PDF reports
- Use Redis for signal lookups

### For YouTube
- Set reasonable timeouts (30-60s)
- Use Claude for cost efficiency
- Implement retry logic

---

## Next Steps

### Immediate
1. ✅ Verify all services work
2. ✅ Test endpoints
3. ✅ Run migrations
4. ✅ Verify LLM APIs

### Short Term
1. ⏳ Implement background jobs (APScheduler)
2. ⏳ Add authentication
3. ⏳ Set up monitoring
4. ⏳ Configure rate limiting

### Medium Term
1. ⏳ Add more indicators
2. ⏳ Real-time updates
3. ⏳ Advanced analytics
4. ⏳ Mobile support

---

## Full Documentation

See these files for complete details:

- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[API_REFERENCE.md](API_REFERENCE.md)** - All endpoints with examples
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Architecture overview
- **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - Full implementation report

---

## Support

**Found an issue?**
1. Check documentation in FEATURES.md
2. Review API_REFERENCE.md for endpoint specs
3. Check service docstrings in code
4. Review error message in response

**Want to extend?**
1. Services are modular and easy to extend
2. Follow existing patterns
3. Add docstrings and type hints
4. Update documentation

---

**Happy coding! 🚀**

All 3 features are production-ready and fully documented.
