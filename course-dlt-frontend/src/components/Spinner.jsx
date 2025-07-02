import React from 'react';

export default function Spinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50 mb-4"></div>
      {message && <div className="text-blue-700 font-semibold">{message}</div>}
    </div>
  );
} 