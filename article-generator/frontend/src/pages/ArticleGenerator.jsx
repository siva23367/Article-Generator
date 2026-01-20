import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI } from '../api/api';

const ArticleGenerator = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await articleAPI.generateFullArticle(query, url || null);
      navigate('/article', { state: { article: response.article, seo: response.seo, html: response.html } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Generate Article</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Article Query *</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.textarea}
              placeholder="e.g., Write an article about Trump and the Venezuela attack"
              required
              rows={4}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Context URL (Optional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
              placeholder="https://example.com/article"
            />
            <small style={styles.hint}>Add a URL to provide additional context for the article</small>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Generating...' : 'Generate Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fa',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  title: {
    margin: '0 0 30px 0',
    color: '#333',
    fontSize: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
  },
  hint: {
    color: '#666',
    fontSize: '12px',
  },
  button: {
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  error: {
    padding: '12px',
    background: '#fee',
    color: '#c33',
    borderRadius: '6px',
    fontSize: '14px',
  },
};

export default ArticleGenerator;
