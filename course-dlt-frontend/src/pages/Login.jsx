import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';

export default function Login({ setToast }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      setToast('Login successful!', 'success');
      navigate('/');
    } catch (err) {
      setToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
        <FormInput label="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus autoComplete="username" />
        <FormInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60" disabled={loading} aria-busy={loading} aria-label="Login">
          {loading ? <Spinner message="Logging in..." /> : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </div>
    </div>
  );
} 