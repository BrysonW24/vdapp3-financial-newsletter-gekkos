# API Reference - New Endpoints

Complete API documentation for the three new feature sets.

---

## Portfolio API

### Base Path: `/portfolio`

#### 1. Create Portfolio
**POST** `/portfolio/`

Create a new portfolio for a user.

**Request Body:**
```json
{
  "user_id": "user123",
  "name": "My Tech Stocks",
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 10,
      "avg_buy_price": 150.00
    },
    {
      "symbol": "MSFT",
      "quantity": 5,
      "avg_buy_price": 320.00
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": "user123",
  "name": "My Tech Stocks",
  "created_at": "2024-11-24T10:30:00Z"
}
```

**Errors:**
- `400`: Portfolio name already exists for user

---

#### 2. List User Portfolios
**GET** `/portfolio/{user_id}`

Get all portfolios for a specific user.

**Parameters:**
- `user_id` (path): User ID

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "name": "My Tech Stocks",
    "created_at": "2024-11-24T10:30:00Z"
  },
  {
    "id": 2,
    "user_id": "user123",
    "name": "Dividend Portfolio",
    "created_at": "2024-11-23T15:45:00Z"
  }
]
```

---

#### 3. Get Portfolio Holdings
**GET** `/portfolio/{portfolio_id}/holdings`

Get all stock holdings in a portfolio.

**Parameters:**
- `portfolio_id` (path): Portfolio ID

**Response (200):**
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "quantity": "10",
    "avg_buy_price": "150.00"
  },
  {
    "id": 2,
    "symbol": "MSFT",
    "quantity": "5",
    "avg_buy_price": "320.00"
  }
]
```

**Errors:**
- `404`: Portfolio not found

---

#### 4. Add Holding
**POST** `/portfolio/{portfolio_id}/holdings`

Add a new stock holding to a portfolio.

**Parameters:**
- `portfolio_id` (path): Portfolio ID

**Request Body:**
```json
{
  "symbol": "GOOGL",
  "quantity": 3,
  "avg_buy_price": 2800.00
}
```

**Response (200):**
```json
{
  "id": 3,
  "symbol": "GOOGL",
  "quantity": "3",
  "avg_buy_price": "2800.00"
}
```

**Errors:**
- `404`: Portfolio not found
- `400`: Holding already exists

---

#### 5. Update Holding
**PUT** `/portfolio/{portfolio_id}/holdings/{holding_id}`

Update an existing holding (quantity or cost basis).

**Parameters:**
- `portfolio_id` (path): Portfolio ID
- `holding_id` (path): Holding ID

**Request Body:**
```json
{
  "quantity": 15,
  "avg_buy_price": 155.00
}
```

**Response (200):**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "quantity": "15",
  "avg_buy_price": "155.00"
}
```

**Errors:**
- `404`: Holding or portfolio not found

---

#### 6. Delete Holding
**DELETE** `/portfolio/{portfolio_id}/holdings/{holding_id}`

Remove a holding from a portfolio.

**Parameters:**
- `portfolio_id` (path): Portfolio ID
- `holding_id` (path): Holding ID

**Response (200):**
```json
{
  "status": "deleted"
}
```

**Errors:**
- `404`: Holding or portfolio not found

---

#### 7. Get Portfolio Performance
**GET** `/portfolio/{portfolio_id}/performance`

Get historical performance metrics for a portfolio.

**Parameters:**
- `portfolio_id` (path): Portfolio ID
- `days` (query): Number of days to look back (default: 30)

**Response (200):**
```json
{
  "performance": {
    "period_return_percent": 5.25,
    "current_value": 45250.00,
    "total_gain_loss": 2150.00,
    "as_of_date": "2024-11-24"
  },
  "historical": [
    {
      "date": "2024-10-25",
      "value": 43100.00,
      "gain_loss": 0.00
    },
    {
      "date": "2024-10-26",
      "value": 43450.00,
      "gain_loss": 350.00
    },
    {
      "date": "2024-11-24",
      "value": 45250.00,
      "gain_loss": 2150.00
    }
  ]
}
```

**Errors:**
- `404`: Portfolio not found

---

#### 8. Get Portfolio Relevant News
**GET** `/portfolio/{portfolio_id}/news`

Get news articles relevant to portfolio holdings.

**Parameters:**
- `portfolio_id` (path): Portfolio ID
- `days` (query): Days to look back (default: 7)
- `limit` (query): Max articles (default: 20)

**Response (200):**
```json
{
  "news": [
    {
      "title": "Apple Reports Strong Q4 Earnings",
      "summary": "Apple exceeded expectations with record iPhone sales...",
      "source": "Financial Times",
      "url": "https://...",
      "published_at": "2024-11-23T09:30:00Z",
      "category": "stocks"
    },
    {
      "title": "Microsoft Announces New AI Features",
      "summary": "Microsoft integrates advanced AI into Office suite...",
      "source": "TechCrunch",
      "url": "https://...",
      "published_at": "2024-11-22T14:15:00Z",
      "category": "technology"
    }
  ]
}
```

**Errors:**
- `404`: Portfolio not found

---

## YouTube Summarizer API

### Base Path: `/youtube`

#### 1. Submit for Summarization
**POST** `/youtube/summarize`

Submit a YouTube video for transcript extraction and summarization.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "llm_provider": "anthropic",
  "format": "bullet_points"
}
```

**Parameters:**
- `llm_provider`: "anthropic" or "openai" (default: anthropic)
- `format`: "bullet_points" or "paragraphs" (default: bullet_points)

**Response (200):**
```json
{
  "status": "processing",
  "video_id": "dQw4w9WgXcQ",
  "message": "Transcript is being processed. Check back soon."
}
```

**Errors:**
- `400`: Invalid YouTube URL
- `400`: Could not extract video ID

---

#### 2. Check Processing Status
**GET** `/youtube/status/{video_id}`

Check the status of a processing job and get results if complete.

**Parameters:**
- `video_id` (path): YouTube video ID

**Response While Processing (200):**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "processing",
  "message": null,
  "summary_count": null,
  "summaries": []
}
```

**Response When Complete (200):**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "completed",
  "message": null,
  "summary_count": 12,
  "summaries": [
    "First major topic discussed in the video",
    "Key insight about market trends",
    "Important recommendation for investors",
    "Risk factor to consider",
    "Action item #1",
    "Action item #2",
    "Supporting evidence for main point",
    "Comparison with competitors",
    "Future outlook discussion",
    "Q&A highlights",
    "Final recommendations",
    "Call to action"
  ]
}
```

**Response on Error (200):**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "error",
  "message": "No transcript found for this video",
  "summary_count": null,
  "summaries": []
}
```

**Errors:**
- `404`: Job not found

---

#### 3. Get Results
**GET** `/youtube/results/{video_id}`

Get completed summarization results (fails if job not finished).

**Parameters:**
- `video_id` (path): YouTube video ID

**Response (200):**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "completed",
  "summary_count": 12,
  "summaries": [
    "Point 1",
    "Point 2",
    "..."
  ]
}
```

**Errors:**
- `404`: Job not found
- `202`: Job not yet complete (includes status message)

---

#### 4. Extract Timestamped Key Points
**POST** `/youtube/extract-timestamps`

Extract key points with their exact timestamps from video.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "llm_provider": "anthropic",
  "format": "bullet_points"
}
```

**Response (200):**
```json
{
  "status": "processing",
  "video_id": "dQw4w9WgXcQ",
  "message": "Extracting timestamps. Check back soon."
}
```

Then check status with same `video_id`:

**Status Response (200):**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "status": "completed",
  "points_count": 8,
  "points": [
    {
      "timestamp": "00:15",
      "point": "Introduction to topic"
    },
    {
      "timestamp": "02:45",
      "point": "Key market insight about emerging trends"
    },
    {
      "timestamp": "05:30",
      "point": "Recommended investment strategy"
    },
    {
      "timestamp": "08:12",
      "point": "Risk considerations and warnings"
    },
    {
      "timestamp": "10:50",
      "point": "Expert opinion on future outlook"
    },
    {
      "timestamp": "14:20",
      "point": "Actionable steps for viewers"
    },
    {
      "timestamp": "17:45",
      "point": "Summary of main points"
    },
    {
      "timestamp": "19:30",
      "point": "Call to action and resources"
    }
  ]
}
```

---

## Charts/Signals API

### Base Path: `/charts` (Future Implementation)

These endpoints are ready to be implemented. Services are fully functional.

#### Planned Endpoints

**GET** `/charts/signals?days=7&signal_type=bullish_cross&asset_class=equity`

Get recent technical signals (crossovers).

**GET** `/charts/timeseries/{symbol}?limit=100`

Get historical price data with moving averages.

**GET** `/charts/metadata`

Get information about tracked symbols.

**POST** `/charts/generate-report`

Generate Druckenmiller analysis PDF report.

**GET** `/charts/pdf/{date}`

Download PDF report for specific date.

---

## Error Responses

### Standard Error Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (processing) |
| 400 | Bad Request (invalid input) |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

*To be implemented*

Expected limits:
- Portfolio endpoints: 100 requests/minute
- YouTube endpoints: 10 requests/minute (due to LLM cost)
- Charts endpoints: 50 requests/minute

---

## Authentication

*To be implemented*

Expected: Bearer token in `Authorization` header

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/portfolio/1
```

---

## Pagination

*To be implemented for list endpoints*

Expected query parameters:
- `skip`: Number of items to skip (default: 0)
- `limit`: Number of items to return (default: 20, max: 100)

---

## Example Workflows

### Complete Portfolio Tracking Workflow

```bash
# 1. Create portfolio
curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "name": "Growth Portfolio",
    "holdings": [
      {"symbol": "AAPL", "quantity": 10, "avg_buy_price": 150},
      {"symbol": "GOOGL", "quantity": 5, "avg_buy_price": 2800}
    ]
  }' > portfolio_response.json

PORTFOLIO_ID=$(jq '.id' portfolio_response.json)

# 2. Get initial holdings
curl http://localhost:8000/portfolio/$PORTFOLIO_ID/holdings

# 3. Add new holding
curl -X POST http://localhost:8000/portfolio/$PORTFOLIO_ID/holdings \
  -H "Content-Type: application/json" \
  -d '{"symbol": "MSFT", "quantity": 3, "avg_buy_price": 320}'

# 4. Monitor performance daily
curl http://localhost:8000/portfolio/$PORTFOLIO_ID/performance?days=30

# 5. Check relevant news
curl "http://localhost:8000/portfolio/$PORTFOLIO_ID/news?days=7&limit=10"
```

### Complete YouTube Summarization Workflow

```bash
# 1. Submit video
curl -X POST http://localhost:8000/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtube.com/watch?v=...",
    "llm_provider": "anthropic",
    "format": "bullet_points"
  }' > youtube_response.json

VIDEO_ID=$(jq '.video_id' youtube_response.json)

# 2. Poll status (or set up webhook - future)
while true; do
  STATUS=$(curl http://localhost:8000/youtube/status/$VIDEO_ID | jq '.status')
  echo "Status: $STATUS"
  if [ "$STATUS" = '"completed"' ]; then
    break
  fi
  sleep 5
done

# 3. Get results
curl http://localhost:8000/youtube/results/$VIDEO_ID | jq '.summaries'

# 4. Optionally extract timestamps
curl -X POST http://localhost:8000/youtube/extract-timestamps \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=...", "llm_provider": "anthropic"}'
```

---

## Testing with cURL

```bash
# Test portfolio creation
curl -X POST http://localhost:8000/portfolio/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "name": "Test Portfolio",
    "holdings": [{"symbol": "AAPL", "quantity": 1, "avg_buy_price": 150}]
  }' | jq

# Test YouTube
curl -X POST http://localhost:8000/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "llm_provider": "anthropic"
  }' | jq
```

---

## WebSocket Support

*To be implemented for real-time updates*

Expected:
- Portfolio value updates
- Price alerts
- News notifications
- Processing status updates

```javascript
// Future WebSocket API
const ws = new WebSocket('ws://localhost:8000/ws/portfolio/1');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Portfolio updated:', update);
};
```

---

## Webhook Support

*To be implemented*

Expected: Send POST to user-provided URL when:
- Portfolio snapshot created
- Significant price movement detected
- News article matches portfolio
- YouTube summarization complete
- Technical signal detected

---

## Rate Limit Headers

*To be implemented*

Expected response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700860800
```

---

For full documentation and examples, see [FEATURES.md](./FEATURES.md)
