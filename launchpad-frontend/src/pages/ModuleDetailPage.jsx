import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ModuleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(null);

  useEffect(() => {
    loadModule();
  }, [slug]);

  const loadModule = async () => {
    try {
      const { data } = await apiClient.get(`/modules/${slug}`);
      setModule(data);
    } catch (error) {
      console.error('Failed to load module:', error);
    }
    setLoading(false);
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    setUpdatingTask(taskId);
    try {
      await apiClient.patch(`/tasks/${taskId}/completion`, {
        completed: !currentStatus
      });
      
      // Update local state
      setModule(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        ),
        completed_tasks: !currentStatus ? prev.completed_tasks + 1 : prev.completed_tasks - 1,
        progress_percentage: Math.round(((!currentStatus ? prev.completed_tasks + 1 : prev.completed_tasks - 1) / prev.total_tasks) * 100)
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    setUpdatingTask(null);
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
      textDecoration: 'none',
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
    content: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 40px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      color: 'var(--muted)',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '30px',
    },
    moduleHeader: {
      marginBottom: '40px',
    },
    moduleIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    moduleTitle: {
      fontSize: '42px',
      fontWeight: '700',
      color: 'var(--text)',
      marginBottom: '12px',
    },
    moduleDesc: {
      fontSize: '18px',
      color: 'var(--muted)',
      lineHeight: '1.6',
      marginBottom: '30px',
    },
    progressSection: {
      background: 'var(--card)',
      padding: '24px',
      borderRadius: 'var(--radius)',
      marginBottom: '40px',
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    progressLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text)',
    },
    progressPercentage: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--text)',
    },
    progressBar: {
      height: '8px',
      background: '#e5e5e5',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      background: 'var(--accent)',
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: '13px',
      color: 'var(--muted)',
    },
    taskList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    taskItem: {
      background: 'var(--card)',
      padding: '20px 24px',
      borderRadius: 'var(--radius)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      cursor: 'pointer',
      transition: 'box-shadow 0.15s ease',
    },
    checkbox: {
      width: '22px',
      height: '22px',
      minWidth: '22px',
      borderRadius: '6px',
      border: '2px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '2px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },
    checkboxChecked: {
      background: 'var(--accent)',
      borderColor: 'var(--accent)',
    },
    checkmark: {
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: 'var(--text)',
      marginBottom: '6px',
    },
    taskTitleCompleted: {
      color: 'var(--muted)',
      textDecoration: 'line-through',
    },
    taskDesc: {
      fontSize: '14px',
      color: 'var(--muted)',
      lineHeight: '1.5',
    },
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: 'var(--muted)'}}>Loading...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: 'var(--muted)'}}>Module not found</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/dashboard" style={styles.headerTitle}>Launchpad</Link>
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

      <div style={styles.content}>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to modules
        </Link>

        <div style={styles.moduleHeader}>
          <div style={styles.moduleIcon}>{module.icon}</div>
          <h1 style={styles.moduleTitle}>{module.name}</h1>
          <p style={styles.moduleDesc}>{module.description}</p>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Your Progress</span>
            <span style={styles.progressPercentage}>{module.progress_percentage}%</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{...styles.progressFill, width: `${module.progress_percentage}%`}}
            />
          </div>
          <p style={styles.progressText}>
            {module.completed_tasks} of {module.total_tasks} tasks completed
          </p>
        </div>

        <ul style={styles.taskList}>
          {module.tasks.map((task) => (
            <li
              key={task.id}
              style={styles.taskItem}
              onClick={() => toggleTaskCompletion(task.id, task.completed)}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{
                ...styles.checkbox,
                ...(task.completed ? styles.checkboxChecked : {})
              }}>
                {task.completed && <span style={styles.checkmark}>✓</span>}
              </div>
              <div style={styles.taskContent}>
                <h3 style={{
                  ...styles.taskTitle,
                  ...(task.completed ? styles.taskTitleCompleted : {})
                }}>
                  {task.title}
                </h3>
                {task.description && (
                  <p style={styles.taskDesc}>{task.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
