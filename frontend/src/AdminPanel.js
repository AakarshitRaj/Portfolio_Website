// src/AdminPanel.js - SECURE VERSION (Password verified by backend!)
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

// Backend API URL - No secrets here!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminPanel() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState('');

  // Check if already logged in (from sessionStorage)
  useEffect(() => {
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchContacts();
    }
  }, []);

  // Login function - Verifies password with backend
  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        sessionStorage.setItem('adminToken', data.token);
        setPassword('');
        fetchContacts();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    setPassword('');
    setContacts([]);
    sessionStorage.removeItem('adminToken');
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.contacts.reverse()); // Show newest first
      } else {
        setError('Failed to load contacts');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Check console for details.');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchContacts();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h2>🔒 Admin Login</h2>
          <p>Enter your admin password to view contact messages</p>
          
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="password-input"
            disabled={loading}
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={handleLogin} 
            className="login-btn"
            disabled={loading || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="login-footer">
            <a href="/">← Back to Portfolio</a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>📧 Contact Messages</h1>
          <p>View and manage form submissions</p>
        </div>
        <div className="header-actions">
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && contacts.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No messages yet!</h3>
          <p>Messages from your contact form will appear here.</p>
        </div>
      )}

      {/* Messages Grid */}
      {!loading && contacts.length > 0 && (
        <>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Messages:</span>
              <span className="stat-value">{contacts.length}</span>
            </div>
          </div>

          <div className="messages-grid">
            {contacts.map((contact, idx) => (
              <div key={idx} className="message-card">
                <div className="message-header">
                  <div className="sender-info">
                    <h3>{contact.Name || contact.name}</h3>
                    <a href={`mailto:${contact.Email || contact.email}`} className="email-link">
                      {contact.Email || contact.email}
                    </a>
                  </div>
                  <span className="timestamp">
                    {new Date(contact.Timestamp || contact.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="message-body">
                  <p>{contact.Message || contact.message}</p>
                </div>
                
                <div className="message-actions">
                  <a 
                    href={`mailto:${contact.Email || contact.email}?subject=Re: Your message&body=Hi ${contact.Name || contact.name},%0D%0A%0D%0A`}
                    className="reply-btn"
                  >
                    📧 Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="admin-footer">
        <a href="/">← Back to Portfolio</a>
        <span>•</span>
        <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer">
          Open Google Sheet →
        </a>
      </div>
    </div>
  );
}

export default AdminPanel;