# Tool-Grounded Article Generator 

A lightweight content generation system that combines AI, web search, and full-stack functionality.

## 🔗 Live Demo

Access the deployed application here:

👉 https://article-generator-iota.vercel.app/login

## Demo Credentials
- Username: `admin`
- Password: `admin123`

## Features

1. **Content Query Input** - Accept article topics via user query
2. **Web Search Integration** - Uses LLM with web search grounding for research
3. **URL Context Support** - Optionally provide URLs as additional context
4. **Structured Article Generation** - Produces articles in JSON format
5. **SEO Metadata Generation** - Automatically generates SEO-optimized metadata including Open Graph tags
6. **HTML Document Production** - Creates polished HTML documents with styling
7. **Authentication** - Simple login-based authentication (no sign-up required)
8. **Protected Routes** - Frontend routes protected by authentication
9. **Article Display** - Preview generated HTML with SEO metadata
10. **HTML Download** - Download the generated article as an HTML file
11. **Rate Limiting Handling** - Gracefully handles API rate limits and search throttling

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- OpenRouter - Article generation (uses xiaomi/mimo-v2-flash:free model)
- Google Search - Web search integration (with rate limiting handling)
- JWT - Authentication
- BeautifulSoup - Web scraping
- Requests - HTTP client

### Frontend
- React - UI framework
- Vite - Build tool
- React Router - Routing
- Axios - HTTP client

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API key:
```
SECRET_KEY=your-secret-key-change-in-production
OPENROUTER_API_KEY=your-openrouter-api-key
```

5. Get an OpenRouter API key from https://openrouter.ai/

6. Start the backend server:
```bash
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## Default Credentials

- **Username:** admin
- **Password:** admin123

## Usage

1. Open `http://localhost:5173` in your browser
2. Login with default credentials
3. Enter your article query (e.g., "Write an article about Trump and the Venezuela attack")
4. Optionally add a URL for additional context
5. Click "Generate Article"
6. View the generated article with SEO metadata (including OG tags)
7. Download the HTML file if desired

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/me` - Get current user

### Article Generation
- `POST /api/generate-article` - Generate article JSON
- `POST /api/generate-seo` - Generate SEO metadata
- `POST /api/generate-html` - Generate HTML document
- `POST /api/generate-full-article` - Generate all at once



## Project Structure

```
article-generator/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication logic
│   ├── config.py            # Configuration
│   ├── models.py            # Pydantic models
│   ├── article_generator.py # Article generation
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── context/         # React Context
    │   └── api/             # API service
    └── package.json         # Node dependencies
```

## Notes

- The backend requires a valid OpenRouter API key for article generation
- The application uses OpenRouter with the xiaomi/mimo-v2-flash:free model
- Google Search may be rate-limited; the app handles this gracefully by continuing generation without search context
- In production, change the default `SECRET_KEY` in `.env`
- The default user credentials are in `config.py` - change for production
