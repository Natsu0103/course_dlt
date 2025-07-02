import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" />;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome to Course DLT</h1>
      <p className="text-lg text-gray-700 mb-8">A modern, secure platform for course registration using blockchain technology.</p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Login</Link>
        <Link to="/register" className="bg-gray-200 text-blue-700 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition">Register</Link>
      </div>
    </div>
  );
} 