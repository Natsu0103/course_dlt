import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

export default function MyRegistrations({ setToast }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchRegs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/registrations');
        setRegs(res.data);
      } catch (e) {
        setErr('Failed to load registrations');
        setToast('Failed to load registrations', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, [setToast]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-700">My Registrations</h2>
      {err && <div className="mb-2 text-red-600">{err}</div>}
      {loading ? <Spinner message="Loading registrations..." /> : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Course</th>
              <th className="p-2">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {regs.map(reg => (
              <tr key={reg.id} className="border-t">
                <td className="p-2 font-medium">{reg.course}</td>
                <td className="p-2">{new Date(reg.registered_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 