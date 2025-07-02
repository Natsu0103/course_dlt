import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormInput from '../components/FormInput';
import Spinner from '../components/Spinner';

export default function Admin({ setToast }) {
  const [courses, setCourses] = useState([]);
  const [regs, setRegs] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cRes = await axios.get('/api/courses');
      setCourses(cRes.data);
      const rRes = await axios.get('/api/registrations?all=1');
      setRegs(rRes.data);
    } catch {
      setErr('Failed to load data');
      setToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [setToast]);

  const handleAdd = async (e) => {
    e.preventDefault(); setMsg(''); setErr(''); setActionLoading(true);
    try {
      await axios.post('/api/courses', { name, description: desc });
      setMsg('Course added!'); setToast('Course added!', 'success'); setName(''); setDesc('');
      fetchData();
    } catch (e) {
      setErr(e.response?.data?.message || 'Add failed');
      setToast(e.response?.data?.message || 'Add failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditId(course.id); setEditName(course.name); setEditDesc(course.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setMsg(''); setErr(''); setActionLoading(true);
    try {
      await axios.put(`/api/courses/${editId}`, { name: editName, description: editDesc });
      setMsg('Course updated!'); setToast('Course updated!', 'success'); setEditId(null);
      fetchData();
    } catch (e) {
      setErr(e.response?.data?.message || 'Update failed');
      setToast(e.response?.data?.message || 'Update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setMsg(''); setErr('');
    if (!window.confirm('Delete this course?')) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/courses/${id}`);
      setMsg('Course deleted!'); setToast('Course deleted!', 'success');
      fetchData();
    } catch (e) {
      setErr(e.response?.data?.message || 'Delete failed');
      setToast(e.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white p-2 sm:p-4 md:p-6 rounded shadow w-full max-w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-blue-700">Add Course</h2>
        {msg && <div className="mb-2 text-green-600 text-sm">{msg}</div>}
        {err && <div className="mb-2 text-red-600 text-sm">{err}</div>}
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 sm:gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <FormInput label="Name" value={name} onChange={e => setName(e.target.value)} required inputClassName="w-full" />
          </div>
          <div className="flex-1">
            <FormInput label="Description" value={desc} onChange={e => setDesc(e.target.value)} required inputClassName="w-full" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 text-base sm:text-lg" disabled={actionLoading} aria-busy={actionLoading} aria-label="Add Course">
            {actionLoading ? <Spinner message="Adding..." /> : 'Add'}
          </button>
        </form>
      </div>
      <div className="bg-white p-2 sm:p-4 md:p-6 rounded shadow w-full max-w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-blue-700">Courses</h2>
        {loading ? <Spinner message="Loading courses..." /> : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[500px] text-xs sm:text-sm md:text-base table-auto border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t">
                    <td className="p-2 font-medium">
                      {editId === course.id ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="border px-2 py-1 rounded w-full" />
                      ) : course.name}
                    </td>
                    <td className="p-2">
                      {editId === course.id ? (
                        <input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="border px-2 py-1 rounded w-full" />
                      ) : course.description}
                    </td>
                    <td className="p-2 space-x-2">
                      {editId === course.id ? (
                        <>
                          <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60 text-xs sm:text-sm md:text-base" disabled={actionLoading} aria-busy={actionLoading} aria-label="Save Course">Save</button>
                          <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-xs sm:text-sm md:text-base">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(course)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs sm:text-sm md:text-base">Edit</button>
                          <button onClick={() => handleDelete(course.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-60 text-xs sm:text-sm md:text-base" disabled={actionLoading} aria-busy={actionLoading} aria-label="Delete Course">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-white p-2 sm:p-4 md:p-6 rounded shadow w-full max-w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-blue-700">All Registrations</h2>
        {loading ? <Spinner message="Loading registrations..." /> : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[500px] text-xs sm:text-sm md:text-base table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">User</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {regs.map(reg => (
                  <tr key={reg.id} className="border-t">
                    <td className="p-2">{reg.username}</td>
                    <td className="p-2">{reg.course}</td>
                    <td className="p-2">{new Date(reg.registered_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 