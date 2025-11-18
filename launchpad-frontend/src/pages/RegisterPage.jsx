import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    wrapper: {
      width: '100%',
      maxWidth: '450px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--text)',
      marginBottom: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: 'var(--muted)',
    },
    card: {
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      padding: '32px',
    },
    error: {
      marginBottom: '24px',
      padding: '16px',
      borderRadius: 'var(--radius)',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      fontSize: '14px',
      color: '#dc2626',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text)',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 'var(--radius)',
      border: '1px solid #e5e5e5',
      fontSize: '15px',
      background: 'var(--bg)',
      color: 'var(--text)',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius)',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px',
      color: 'var(--muted)',
    },
    link: {
      color: 'var(--primary)',
      fontWeight: '500',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Launchpad</h1>
          <p style={styles.subtitle}>Start your journey</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              style={styles.input}
              placeholder="Your name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              style={styles.input}
              placeholder="Min 8 characters"
              minLength={8}
            />
          </div>

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            style={{...styles.button, opacity: loading ? 0.5 : 1}}
            onMouseOver={(e) => e.target.style.opacity = loading ? 0.5 : 0.9}
            onMouseOut={(e) => e.target.style.opacity = loading ? 0.5 : 1}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
