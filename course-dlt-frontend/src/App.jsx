import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import MyRegistrations from './pages/MyRegistrations';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Spinner from './components/Spinner';
import Toast from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" />;
  return children;
}

function MainRoutes({ setToast }) {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login setToast={setToast} />} />
      <Route path="/register" element={<Register setToast={setToast} />} />
      <Route path="/" element={user ? <Courses setToast={setToast} /> : <Home />} />
      <Route path="/my-registrations" element={
        <ProtectedRoute><MyRegistrations setToast={setToast} /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}><Admin setToast={setToast} /></ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const { loading, authError } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'success' });

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-2 sm:py-4 text-base sm:text-lg">
          {loading ? (
            <Spinner message="Loading..." />
          ) : (
            <MainRoutes setToast={(msg, type = 'success') => setToast({ message: msg, type })} />
          )}
        </main>
        <Toast
          message={authError || toast.message}
          type={authError ? 'error' : toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    </AuthProvider>
  );
} 