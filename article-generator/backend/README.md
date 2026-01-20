# Article Generator Backend

FastAPI backend for the Article Generator application.

## Features

- JWT authentication
- Article generation with web search integration
- SEO metadata generation (including Open Graph tags)
- HTML document generation
- Protected API endpoints
- Rate limiting handling for Google Search
- Error handling for API responses

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your API key:
```bash
SECRET_KEY=your-secret-key-change-in-production
OPENROUTER_API_KEY=your-openrouter-api-key
```

4. Get an OpenRouter API key from https://openrouter.ai/

5. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Default Credentials

- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/login` - Login and get access token
- `GET /api/me` - Get current user info (requires authentication)

### Article Generation
- `POST /api/generate-article` - Generate article (JSON only)
- `POST /api/generate-seo` - Generate SEO metadata
- `POST /api/generate-html` - Generate HTML document
- `POST /api/generate-full-article` - Generate article, SEO, and HTML in one call

## Architecture

- `main.py` - FastAPI application and routes
- `auth.py` - Authentication logic
- `config.py` - Configuration management
- `models.py` - Pydantic models
- `article_generator.py` - Article generation logic with OpenRouter and web search

## AI Model

The backend uses OpenRouter with the `xiaomi/mimo-v2-flash:free` model for article generation. This provides:

- Free tier access
- No quota limitations
- Fast response times
- Good quality output

## Search Integration

The application uses Google Search for web scraping and context gathering. When Google rate limits the search (HTTP 429), the application:

- Automatically adds a delay and retries
- Continues article generation even if search fails
- Logs errors for debugging

## Error Handling

- JSON parsing includes regex extraction for cleaner output
- API responses are validated before processing
- Graceful degradation when search is unavailable
