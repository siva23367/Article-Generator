# Article Generator Frontend

React frontend for the Article Generator application.

## Features

- User authentication with JWT
- Article generation form
- Article preview with HTML rendering
- SEO metadata display (including Open Graph tags)
- HTML file download
- Protected routes
- Tabbed interface for preview and JSON data
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/pages/` - Page components (Login, ArticleGenerator, ArticleDisplay)
- `src/components/` - Reusable components (ProtectedRoute, Navbar)
- `src/context/` - React Context (AuthContext)
- `src/api/` - API service layer
- `src/App.jsx` - Main application component with routing
- `src/main.jsx` - Application entry point

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Default Credentials

- Username: `admin`
- Password: `admin123`

## Routing

- `/login` - Login page
- `/` - Article generator form (protected)
- `/article` - Article display page (protected)

## Features Breakdown

### Login Page
- Simple username/password form
- JWT token storage in localStorage
- Redirects to article generator on success

### Article Generator Page
- Query input field
- Optional URL input for additional context
- Generate button with loading state
- Error handling and display

### Article Display Page
- Two tabs: Preview and JSON Data
- Preview: Displays the generated HTML in an iframe
- JSON Data: Shows raw article and SEO data
- Sidebar displays:
  - SEO Title
  - SEO Description
  - Keywords (as tags)
  - Open Graph tags (OG Title and OG Description)
- Download HTML button
- New Article and Logout buttons

## Authentication

The app uses JWT-based authentication. Tokens are stored in localStorage and automatically sent with API requests.

## Styling

The application uses inline styles for simplicity and portability. The design features:

- Clean, modern interface
- Responsive layout
- Color-coded elements (purple accents)
- Proper spacing and typography
- Interactive hover states
