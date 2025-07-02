import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link to="/" className="block px-4 py-2 font-bold text-lg text-blue-600" onClick={() => setMenuOpen(false)}>Course DLT</Link>
      {user && <Link to="/my-registrations" className="block px-4 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>My Registrations</Link>}
      {user?.is_admin && <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Admin</Link>}
      {!user && <>
        <Link to="/login" className="block px-4 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/register" className="block px-4 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Register</Link>
      </>}
      {user && <button onClick={() => { logout(); navigate('/login'); setMenuOpen(false); }} className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">Logout</button>}
    </>
  );

  return (
    <nav className="bg-white shadow mb-6 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Brand and nav links (desktop) */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg text-blue-600">Course DLT</Link>
          <div className="hidden md:flex items-center gap-4">
            {user && <Link to="/my-registrations" className="text-gray-700 hover:text-blue-600">My Registrations</Link>}
            {user?.is_admin && <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>}
          </div>
        </div>
        {/* Right: Auth links (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!user && <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>}
          {user && <button onClick={() => { logout(); navigate('/login'); }} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Logout</button>}
        </div>
        {/* Burger icon (mobile) */}
        <button className="md:hidden flex items-center px-2 py-1" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Overlay menu (mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex">
          <div className="w-64 bg-white h-full shadow-lg p-6 relative animate-slideInLeft">
            <button className="absolute top-4 right-4 text-2xl text-gray-600" onClick={() => setMenuOpen(false)} aria-label="Close menu">&times;</button>
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks}
            </nav>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
}
// Add this to your tailwind.config.js for the animation:
// theme: { extend: { keyframes: { slideInLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } } }, animation: { slideInLeft: 'slideInLeft 0.3s ease-out' } } } 