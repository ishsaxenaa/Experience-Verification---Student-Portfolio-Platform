import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExperienceCard from './ExperienceCard';

const OrgDashboard = ({ token, logout }) => {
  const [formData, setFormData] = useState({ activityName: '', achievementLevel: '', description: '', date: '', studentEmail: '', category: '' });
  const [files, setFiles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All Student Responses');
  const [activityFilter, setActivityFilter] = useState('All Activities');

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await axios.get('/api/experience', config);
        setExperiences(res.data);
      } catch (err) {
        alert('Error fetching: ' + (err.response?.data?.error || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Array.from(files).forEach(file => data.append('documents', file));
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingId) {
        await axios.patch(`/api/experience/${editingId}`, data, config);
        setEditingId(null);
      } else {
        await axios.post('/api/experience', data, config);
      }
      const res = await axios.get('/api/experience', { headers: { Authorization: `Bearer ${token}` } });
      setExperiences(res.data);
      setFormData({ activityName: '', achievementLevel: '', description: '', date: '', studentEmail: '', category: '' });
      setFiles([]);
      setModalOpen(false);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      activityName: exp.activityName,
      achievementLevel: exp.achievementLevel,
      description: exp.description,
      date: exp.date.split('T')[0],
      studentEmail: exp.studentEmail,
      category: exp.category,
    });
    setEditingId(exp._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`/api/experience/${id}`, config);
      setExperiences(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleApprove = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post(`/api/experience/${id}/approve`, {}, config);
      const res = await axios.get('/api/experience', config);
      setExperiences(res.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleReject = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post(`/api/experience/${id}/reject`, {}, config);
      const res = await axios.get('/api/experience', config);
      setExperiences(res.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleView = (exp) => {
    setSelectedExp(exp);
    setViewModalOpen(true);
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || exp.status === statusFilter;
    const matchesStudentStatus = studentStatusFilter === 'All Student Responses' || exp.studentStatus === studentStatusFilter;
    const matchesActivity = activityFilter === 'All Activities' || exp.category === activityFilter;
    return matchesSearch && matchesStatus && matchesStudentStatus && matchesActivity;
  });

  const uniqueStudents = new Set(experiences.map(exp => exp.studentEmail)).size;
  const pendingCount = experiences.filter(exp => exp.status === 'PENDING').length;
  const approvedCount = experiences.filter(exp => exp.status === 'APPROVED').length;

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Organization Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-semibold">Total Students</h3>
          <p className="text-4xl font-bold">{uniqueStudents}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-n font-semibold">Experiences Added</h3>
          <p className="text-4xl font-bold">{experiences.length}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-semibold">Pending Verification</h3>
          <p className="text-4xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-semibold">Verified</h3>
          <p className="text-4xl font-bold">{approvedCount}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Experience Management</h2>
        <button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300">
          + Add Experience
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded-lg text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
          <option>PENDING</option>
          <option>APPROVED</option>
          <option>REJECTED</option>
        </select>
        <select value={studentStatusFilter} onChange={e => setStudentStatusFilter(e.target.value)} className="border p-2 rounded-lg text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500">
          <option>All Student Responses</option>
          <option>PENDING</option>
          <option>ACCEPTED</option>
          <option>DECLINED</option>
        </select>
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by student email..." className="border p-2 rounded-lg flex-1 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500" />
        <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="border p-2 rounded-lg text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500">
          <option>All Activities</option>
          <option>Course</option>
          <option>Competition</option>
          <option>Workshop</option>
        </select>
      </div>
      <div className="space-y-6">
        {filteredExperiences.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No experiences match the filters.</p>
        ) : (
          filteredExperiences.map(exp => (
            <div key={exp._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition duration-300">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-900">{exp.activityName}</h3>
                <p className="text-gray-600">{exp.studentEmail}</p>
                <p className="text-gray-500 text-sm">{exp.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">{exp.category}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">{new Date(exp.date).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full ${exp.status === 'APPROVED' ? 'bg-green-100 text-green-800' : exp.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Org Status: {exp.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${exp.studentStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' : exp.studentStatus === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Student: {exp.studentStatus}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleApprove(exp._id)} className="text-green-500 text-2xl hover:text-green-700 transition" disabled={exp.status !== 'PENDING'}>✔</button>
                <button onClick={() => handleReject(exp._id)} className="text-red-500 text-2xl hover:text-red-700 transition" disabled={exp.status !== 'PENDING'}>✗</button>
                <button onClick={() => handleView(exp)} className="text-blue-500 text-2xl hover:text-blue-700 transition">👁</button>
                <button onClick={() => handleEdit(exp)} className="text-yellow-500 text-2xl hover:text-yellow-700 transition">✏️</button>
                {/* <button onClick={() => handleDelete(exp._id)} className="text-gray-500 text-2xl hover:text-gray-700 transition"></button> */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input name="studentEmail" value={formData.studentEmail} onChange={handleChange} placeholder="Student Email" className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              <input name="activityName" value={formData.activityName} onChange={handleChange} placeholder="Activity Name" className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              <select name="achievementLevel" value={formData.achievementLevel} onChange={handleChange} className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Achievement Level</option>
                <option>Winner</option>
                <option>Participant</option>
                <option>Certificate</option>
              </select>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Category</option>
                <option>Course</option>
                <option>Competition</option>
                <option>Workshop</option>
              </select>
              <input type="file" multiple onChange={handleFileChange} className="w-full border-gray-300 p-2 rounded-lg" />
              <div className="flex justify-end gap-4">
                <button type="submit" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition duration-300">{editingId ? 'Update Experience' : 'Add Experience'}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedExp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">{selectedExp.activityName}</h2>
            </div>
            <div className="mt-4 اجراءات-y-3">
              <p><strong className="text-gray-700">Student:</strong> <span className="text-gray-900">{selectedExp.studentEmail}</span></p>
              <p><strong className="text-gray-700">Description:</strong> <span className="text-gray-900">{selectedExp.description}</span></p>
              <p><strong className="text-gray-700">Achievement Level:</strong> <span className="text-gray-900">{selectedExp.achievementLevel}</span></p>
              <p><strong className="text-gray-700">Category:</strong> <span className="text-gray-900">{selectedExp.category}</span></p>
              <p><strong className="text-gray-700">Date:</strong> <span className="text-gray-900">{new Date(selectedExp.date).toLocaleDateString()}</span></p>
              <p><strong className="text-gray-700">Organization Status:</strong> <span className="text-gray-900">{selectedExp.status}</span></p>
              <p><strong className="text-gray-700">Student Response:</strong> <span className="text-gray-900">{selectedExp.studentStatus}</span></p>
              <p><strong className="text-gray-700">Documents:</strong></p>
              {selectedExp.documents.map((doc, idx) => {
                const fileName = doc.split('/').pop();
                return (
                  <a
                    key={idx}
                    href={`http://localhost:5001/Uploads/${fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    Document {idx + 1}
                  </a>
                );
              })}
            </div>
            <button onClick={() => setViewModalOpen(false)} className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;