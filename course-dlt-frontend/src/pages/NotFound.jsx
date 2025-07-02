import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Go Home</Link>
    </div>
  );
} 