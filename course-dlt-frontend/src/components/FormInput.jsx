import React from 'react';

export default function FormInput({ label, type = 'text', value, onChange, required, ...props }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...props}
      />
    </div>
  );
} 