import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--bg)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 40px',
      borderBottom: '1px solid #eaeaea',
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--text)',
      textDecoration: 'none',
    },
    joinBtn: {
      padding: '10px 22px',
      background: 'var(--primary)',
      color: '#fff',
      borderRadius: 'var(--radius)',
      border: 'none',
      fontSize: '15px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    hero: {
      padding: '110px 40px',
      maxWidth: '900px',
      margin: 'auto',
      textAlign: 'left',
    },
    heroTitle: {
      fontSize: '54px',
      lineHeight: '1.1',
      marginBottom: '25px',
      color: 'var(--text)',
      fontWeight: '700',
    },
    heroSubtitle: {
      fontSize: '20px',
      color: 'var(--muted)',
      maxWidth: '600px',
      lineHeight: '1.6',
      marginBottom: '40px',
    },
    ctaGroup: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
    },
    primaryBtn: {
      padding: '14px 32px',
      background: 'var(--primary)',
      color: '#fff',
      borderRadius: 'var(--radius)',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    secondaryBtn: {
      padding: '14px 32px',
      background: 'transparent',
      color: 'var(--text)',
      borderRadius: 'var(--radius)',
      border: '1px solid #e5e5e5',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    grid: {
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '0 40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '28px',
    },
    card: {
      background: 'var(--card)',
      padding: '30px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      transition: 'transform 0.15s ease',
    },
    cardTitle: {
      margin: '0 0 14px',
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--text)',
    },
    cardDesc: {
      fontSize: '15px',
      color: 'var(--muted)',
      lineHeight: '1.5',
      margin: 0,
    },
    footer: {
      marginTop: '70px',
      padding: '50px 0',
      textAlign: 'center',
      borderTop: '1px solid #eaeaea',
      fontSize: '14px',
      color: 'var(--muted)',
    },
  };

  const modules = [
    {
      title: 'Money',
      description: 'Learn saving, budgeting, credit, and debt with practical, step‑by‑step guides.',
    },
    {
      title: 'Renting',
      description: 'Deposits, leases, inspections, negotiating, avoiding scams — all simplified.',
    },
    {
      title: 'Career',
      description: 'Resumes, interviews, job search systems, and how to grow professionally.',
    },
    {
      title: 'Healthcare',
      description: 'Insurance basics, copays, booking care, and understanding treatment costs.',
    },
    {
      title: 'Taxes',
      description: 'W-2s, 1099s, filing your return, and avoiding beginner mistakes.',
    },
    {
      title: 'Life Skills',
      description: 'Cleaning, cooking, car care, emailing, and personal organization.',
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          Launchpad
        </Link>
        <Link
          to="/register"
          style={styles.joinBtn}
          onMouseOver={(e) => (e.target.style.opacity = 0.9)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          Join
        </Link>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>A cleaner way to learn adulthood.</h2>
        <p style={styles.heroSubtitle}>
          The essential toolkit for young adults navigating money, renting, careers, healthcare, taxes, and real-life responsibilities. No noise. Just clarity.
        </p>
        <div style={styles.ctaGroup}>
          <Link
            to="/register"
            style={styles.primaryBtn}
            onMouseOver={(e) => (e.target.style.opacity = 0.9)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            Get started
          </Link>
          <Link
            to="/login"
            style={styles.secondaryBtn}
            onMouseOver={(e) => (e.target.style.background = '#f9f9f9')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.grid}>
        {modules.map((module, index) => (
          <div
            key={index}
            style={styles.card}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <h3 style={styles.cardTitle}>{module.title}</h3>
            <p style={styles.cardDesc}>{module.description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>Launchpad © 2025 — A simpler adulthood.</footer>
    </div>
  );
}
