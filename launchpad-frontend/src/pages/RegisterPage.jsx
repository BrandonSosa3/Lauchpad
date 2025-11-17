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
    console.log('🎯 BUTTON CLICKED - STAYING ON PAGE');
  
    try {
      await signup(formData.email, formData.password, formData.name);
      console.log('✅ SIGNUP SUCCESS - NOT NAVIGATING');
      alert('Signup successful! Check console.');
      // DON'T NAVIGATE - just stay here
      // navigate('/dashboard');
    } catch (err) {
      console.error('❌ SIGNUP FAILED:', err);
      setError(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🚀 Launchpad</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Sign Up</h2>

          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Min 8 characters"
              />
            </div>

            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-blue-600">Already have an account? Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}