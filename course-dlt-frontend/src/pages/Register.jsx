import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';

export default function Register({ setToast }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password, isAdmin);
      setToast('Registration successful! You can now login.', 'success');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Register form">
        <FormInput label="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus autoComplete="username" />
        <FormInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
          <span>Register as admin</span>
        </label>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60" disabled={loading} aria-busy={loading} aria-label="Register">
          {loading ? <Spinner message="Registering..." /> : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span>Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  );
} 