import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { tweetApi } from './utils/api';
import './App.css';

// Reusable Tweet Component
const Tweet = ({ id, user_id, content, like_count, comment_count, created_at, user_liked, onLike }) => {
  const time = new Date(created_at).toLocaleDateString();
  return (
    <div className="tweet-item" style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      borderBottom: '1px solid var(--border-color)',
      cursor: 'pointer',
      transition: 'var(--transition-fast)'
    }}>
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user_id}`} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333' }} />
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 700 }}>User_{user_id.slice(0, 8)}</span>
          <span style={{ color: 'var(--text-dim)' }}>@{user_id.slice(0, 8)} · {time}</span>
        </div>
        <div style={{ marginBottom: '1rem', lineHeight: '1.4' }}>{content}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', maxWidth: '425px', marginTop: '0.75rem' }}>
          <button className="interaction-btn"><span>💬</span> {comment_count}</button>
          <button className="interaction-btn"><span>🔁</span> 0</button>
          <button className="interaction-btn" onClick={(e) => { e.stopPropagation(); onLike(id); }} style={{ color: user_liked ? 'var(--error)' : 'inherit' }}>
            <span>{user_liked ? '❤️' : '🤍'}</span> {like_count}
          </button>
          <button className="interaction-btn"><span>📊</span> 0</button>
        </div>
      </div>
    </div>
  );
};

// Page Components
const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    try {
      const res = await tweetApi.getTweets();
      setTweets(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch tweets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await tweetApi.postTweet(content);
      setContent('');
      fetchTweets();
    } catch (err) {
      console.error("Failed to post tweet", err);
    }
  };

  const handleLike = async (id) => {
    try {
      await tweetApi.likeTweet(id);
      fetchTweets();
    } catch (err) {
      console.error("Failed to like tweet", err);
    }
  };

  return (
    <>
      <header className="page-header"><h2>Home</h2></header>
      <div className="post-box" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333' }} />
          <div style={{ flexGrow: 1 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's taking flight?!"
              style={{ width: '100%', background: 'none', border: 'none', color: 'white', fontSize: '1.25rem', resize: 'none', outline: 'none', marginBottom: '1rem', paddingTop: '0.5rem' }}
              rows={3}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button onClick={handlePost} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Post</button>
            </div>
          </div>
        </div>
      </div>
      <div className="feed">
        {loading ? <p style={{ padding: '1rem' }}>Loading flights...</p> :
         tweets.map(tweet => <Tweet key={tweet.id} {...tweet} onLike={handleLike} />)}
      </div>
    </>
  );
};

const SidebarItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className="nav-item" style={{
      textDecoration: 'none',
      color: isActive ? 'var(--primary)' : 'inherit',
      fontWeight: isActive ? 700 : 500
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span> {label}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar" style={{ borderRight: '1px solid var(--border-color)', height: '100vh', position: 'sticky', top: 0 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🐦</span> SkyBird
            </div>
          </Link>
          <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SidebarItem to="/" icon="🏠" label="Home" />
            <SidebarItem to="/explore" icon="🔍" label="Explore" />
            <SidebarItem to="/notifications" icon="🔔" label="Notifications" />
            <SidebarItem to="/messages" icon="✉️" label="Messages" />
            <SidebarItem to="/profile" icon="👤" label="Profile" />
          </nav>
          <div style={{ padding: '1rem' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Post</button>
          </div>
        </aside>

        <main style={{ minHeight: '100vh', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', maxWidth: '600px', flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<div className="page-header"><h2>Explore</h2></div>} />
            <Route path="/notifications" element={<div className="page-header"><h2>Notifications</h2></div>} />
            <Route path="/messages" element={<div className="page-header"><h2>Messages</h2></div>} />
            <Route path="/profile" element={<div className="page-header"><h2>Profile</h2></div>} />
          </Routes>
        </main>

        <aside className="widgets">
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>What's happening</h3>
            {[
              { title: "React Conf 2026", sub: "12k posts" },
              { title: "#SkyBird", sub: "Trending now" },
              { title: "Vite JS", sub: "8.5k posts" }
            ].map(item => (
              <div key={item.title} style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Router>
  );
}

export default App;
