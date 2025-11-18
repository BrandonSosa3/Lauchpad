import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const { data } = await apiClient.get('/modules');
      setModules(data);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
    setLoading(false);
  };

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
    headerTitle: {
      margin: 0,
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--text)',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    userName: {
      fontSize: '14px',
      color: 'var(--muted)',
    },
    logoutBtn: {
      padding: '10px 22px',
      background: 'var(--primary)',
      color: '#fff',
      borderRadius: 'var(--radius)',
      border: 'none',
      fontSize: '15px',
      cursor: 'pointer',
    },
    hero: {
      padding: '110px 40px',
      maxWidth: '900px',
      margin: 'auto',
    },
    heroTitle: {
      fontSize: '54px',
      lineHeight: '1.1',
      marginBottom: '25px',
      color: 'var(--text)',
    },
    heroSubtitle: {
      fontSize: '20px',
      color: 'var(--muted)',
      maxWidth: '600px',
      lineHeight: '1.6',
    },
    grid: {
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '0 40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '28px',
    },
    cardLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    card: {
      background: 'var(--card)',
      padding: '30px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      cursor: 'pointer',
      transition: 'transform 0.15s ease',
    },
    cardIcon: {
      fontSize: '32px',
      marginBottom: '14px',
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
      marginBottom: '20px',
    },
    progressContainer: {
      marginTop: '20px',
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: 'var(--muted)',
      marginBottom: '8px',
    },
    progressBar: {
      height: '6px',
      background: '#e5e5e5',
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      background: 'var(--accent)',
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: '12px',
      color: 'var(--muted)',
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

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: 'var(--muted)'}}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Launchpad</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hey, {user?.name || 'there'}!</span>
          <button
            onClick={logout}
            style={styles.logoutBtn}
            onMouseOver={(e) => e.target.style.opacity = 0.9}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Logout
          </button>
        </div>
      </header>

      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>A cleaner way to learn adulthood.</h2>
        <p style={styles.heroSubtitle}>
          The essential toolkit for young adults navigating money, renting, careers, healthcare, taxes, and real-life responsibilities. No noise. Just clarity.
        </p>
      </section>

      <section style={styles.grid}>
        {modules.map((module) => (
          <Link
            key={module.id}
            to={`/modules/${module.slug}`}
            style={styles.cardLink}
          >
            <div
              style={styles.card}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.cardIcon}>{module.icon}</div>
              <h3 style={styles.cardTitle}>{module.name}</h3>
              <p style={styles.cardDesc}>{module.description}</p>

              <div style={styles.progressContainer}>
                <div style={styles.progressHeader}>
                  <span>Progress</span>
                  <span>{module.progress_percentage}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{...styles.progressFill, width: `${module.progress_percentage}%`}}
                  />
                </div>
                <p style={styles.progressText}>
                  {module.completed_tasks} of {module.total_tasks} tasks
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer style={styles.footer}>
        Launchpad © 2025 — A simpler adulthood.
      </footer>
    </div>
  );
}
