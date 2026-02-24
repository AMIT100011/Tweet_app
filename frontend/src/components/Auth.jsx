import { useState } from 'react';
import { supabase } from '../utils/supabase';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        alert('Verification link sent! Please check your email.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(400px, 1.2fr) 1fr',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-main)',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <div className="auth-hero" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1d9bf0 0%, #000 100%)',
        padding: '4rem',
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(29, 155, 240, 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(29, 155, 240, 0.2) 0%, transparent 30%)`,
      }}>
        <div style={{ animation: 'bounce 3s infinite ease-in-out', fontSize: '8rem', marginBottom: '1rem' }}>🐦</div>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem', textAlign: 'center', letterSpacing: '-1px' }}>SkyBird</h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: '400px' }}>
          Connect with the world. Share your flights. Join the conversation.
        </p>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
          gap: '2rem'
        }}>
          <span>About</span>
          <span>Help</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="auth-content" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isRegistering ? 'Create your account' : 'Happening now'}
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            {isRegistering ? 'Step into the sky.' : 'Join SkyBird today.'}
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--error)',
                fontSize: '0.9rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(244, 33, 46, 0.1)',
                borderRadius: '8px',
                borderLeft: '4px solid var(--error)'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '1.1rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '30px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 14px 0 rgba(29, 155, 240, 0.39)'
              }}
            >
              {loading ? 'Taking flight...' : (isRegistering ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>
              {isRegistering ? 'Already have an account?' : 'New to SkyBird?'}
            </p>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '1rem',
                background: 'none',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                width: '100%',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {isRegistering ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 800px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-hero { display: none; }
          .auth-content { padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Auth;

