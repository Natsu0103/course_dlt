import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
    </div>
  );
} 