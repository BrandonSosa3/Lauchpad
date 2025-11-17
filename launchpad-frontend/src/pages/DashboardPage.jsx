import { useState, useEffect } from 'react';
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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🚀 Launchpad</h1>
        <div>
          <span className="mr-4">Hey, {user?.name}!</span>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-xl font-bold mb-4">Your Modules</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">{module.icon}</div>
              <h3 className="text-lg font-bold">{module.name}</h3>
              <p className="text-sm text-gray-600">{module.description}</p>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 rounded"
                    style={{
                      width: `${module.progress_percentage}%`,
                      backgroundColor: module.color,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {module.completed_tasks} / {module.total_tasks} tasks
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
