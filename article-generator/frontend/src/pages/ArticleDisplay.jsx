import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ArticleDisplay = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [article, setArticle] = useState(null);
  const [seo, setSeo] = useState(null);
  const [html, setHtml] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (state?.article && state?.seo && state?.html) {
      setArticle(state.article);
      setSeo(state.seo);
      setHtml(state.html);
    } else {
      navigate('/');
    }
  }, [state, navigate]);

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewArticle = () => {
    navigate('/');
  };

  if (!article || !seo || !html) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Article Generator</h1>
          <p style={styles.subtitle}>Generated Article</p>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={handleNewArticle} style={styles.secondaryButton}>
            New Article
          </button>
          <button onClick={logout} style={styles.secondaryButton}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.mainSection}>
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('preview')}
              style={activeTab === 'preview' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('json')}
              style={activeTab === 'json' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            >
              JSON Data
            </button>
          </div>

          {activeTab === 'preview' && (
            <div style={styles.previewContainer}>
              <iframe
                srcDoc={html}
                style={styles.iframe}
                title="Article Preview"
                sandbox="allow-same-origin"
              />
            </div>
          )}

          {activeTab === 'json' && (
            <div style={styles.jsonContainer}>
              <h3 style={styles.jsonTitle}>Article Data</h3>
              <pre style={styles.json}>{JSON.stringify(article, null, 2)}</pre>
              <h3 style={styles.jsonTitle}>SEO Metadata</h3>
              <pre style={styles.json}>{JSON.stringify(seo, null, 2)}</pre>
            </div>
          )}

          <div style={styles.actions}>
            <button onClick={handleDownload} style={styles.primaryButton}>
              Download HTML
            </button>
          </div>
        </div>

        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>SEO Metadata</h3>
          <div style={styles.sidebarContent}>
            <div style={styles.metaItem}>
              <strong style={styles.metaLabel}>Title:</strong>
              <div style={styles.metaValue}>{seo.title}</div>
            </div>
            <div style={styles.metaItem}>
              <strong style={styles.metaLabel}>Description:</strong>
              <div style={styles.metaValue}>{seo.description}</div>
            </div>
            <div style={styles.metaItem}>
              <strong style={styles.metaLabel}>Keywords:</strong>
              <div style={styles.metaValue}>
                {seo.keywords.map((keyword, index) => (
                  <span key={index} style={styles.keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.metaItem}>
              <strong style={styles.metaLabel}>OG Tags:</strong>
              <div style={styles.metaValue}>
                <div style={styles.ogTagItem}>
                  <div style={styles.ogTagLabel}>OG Title:</div>
                  <div style={styles.ogTagContent}>{seo.meta_tags?.['og:title'] || 'N/A'}</div>
                </div>
                <div style={styles.ogTagItem}>
                  <div style={styles.ogTagLabel}>OG Description:</div>
                  <div style={styles.ogTagContent}>{seo.meta_tags?.['og:description'] || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e1e4e8',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: '#333',
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '14px',
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: 'white',
    color: '#667eea',
    border: '1px solid #667eea',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
    padding: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  mainSection: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '1px solid #e1e4e8',
  },
  tab: {
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
  },
  previewContainer: {
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    overflow: 'hidden',
    background: 'white',
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none',
  },
  jsonContainer: {
    background: '#f6f8fa',
    borderRadius: '6px',
    padding: '20px',
  },
  jsonTitle: {
    margin: '20px 0 10px 0',
    fontSize: '16px',
    color: '#333',
  },
  json: {
    background: '#24292e',
    color: '#e1e4e8',
    padding: '15px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  actions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  sidebar: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sidebarTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  metaLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: '14px',
    color: '#333',
    wordBreak: 'break-word',
  },
  keyword: {
    display: 'inline-block',
    background: '#e1e4e8',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginRight: '5px',
    marginBottom: '5px',
  },
  ogTagItem: {
    marginBottom: '10px',
  },
  ogTagLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '3px',
  },
  ogTagContent: {
    fontSize: '13px',
    color: '#333',
    padding: '8px 12px',
    background: '#f6f8fa',
    borderRadius: '4px',
    border: '1px solid #e1e4e8',
  },
};

export default ArticleDisplay;
