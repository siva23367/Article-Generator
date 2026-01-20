import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ArticleGenerator from './pages/ArticleGenerator';
import ArticleDisplay from './pages/ArticleDisplay';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ArticleGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/article"
        element={
          <ProtectedRoute>
            <ArticleDisplay />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
