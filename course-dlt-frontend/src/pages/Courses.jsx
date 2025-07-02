import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Courses({ setToast }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
      if (user) {
        const regRes = await axios.get('/api/registrations');
        setMyRegs(regRes.data.map(r => r.course));
      } else {
        setMyRegs([]);
      }
    } catch (e) {
      setErr('Failed to load courses');
      setToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); /* eslint-disable-next-line */ }, [user]);

  const handleRegister = async (courseId) => {
    setMsg(''); setErr(''); setActionLoading(courseId);
    try {
      await axios.post('/api/registrations', { course_id: courseId });
      setMsg('Registered successfully!');
      setToast('Registered successfully!', 'success');
      fetchCourses();
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
      setToast(e.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnregister = async (courseId) => {
    setMsg(''); setErr(''); setActionLoading(courseId);
    try {
      await axios.delete(`/api/registrations/${courseId}`);
      setMsg('Unregistered successfully!');
      setToast('Unregistered successfully!', 'success');
      fetchCourses();
    } catch (e) {
      setErr(e.response?.data?.message || 'Unregister failed');
      setToast(e.response?.data?.message || 'Unregister failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-700">Courses</h2>
      {msg && <div className="mb-2 text-green-600">{msg}</div>}
      {err && <div className="mb-2 text-red-600">{err}</div>}
      {loading ? <Spinner message="Loading courses..." /> : (
        courses.length === 0 ? (
          <div className="text-gray-500">No courses available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="border rounded-lg p-5 shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-bold text-blue-800 mb-1">{course.name}</div>
                  <div className="text-gray-700 mb-2">{course.description}</div>
                  <div className="text-xs text-gray-400 mb-2">Created: {new Date(course.created_at).toLocaleString()}</div>
                </div>
                <div>
                  {myRegs.includes(course.name) ? (
                    <button onClick={() => handleUnregister(course.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full mt-2 disabled:opacity-60" disabled={actionLoading === course.id} aria-busy={actionLoading === course.id} aria-label="Unregister">
                      {actionLoading === course.id ? <Spinner message="Unregistering..." /> : 'Unregister'}
                    </button>
                  ) : (
                    <button onClick={() => handleRegister(course.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full mt-2 disabled:opacity-60" disabled={actionLoading === course.id} aria-busy={actionLoading === course.id} aria-label="Register">
                      {actionLoading === course.id ? <Spinner message="Registering..." /> : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
} 