//frontend/src/components/PortfolioBuilder
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioBuilder = ({ user, token, setUser }) => {
  const [profile, setProfile] = useState({
    bio: '',
    description: '',
    profilePic: '',
    skills: [],
    links: { github: '', leetcode: '', figma: '', linkedin: '' },
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user.profile) {
      setProfile({
        bio: user.profile.bio || '',
        description: user.profile.description || '',
        profilePic: user.profile.profilePic || '',
        skills: Array.isArray(user.profile.skills) ? user.profile.skills : [],
        links: user.profile.links || { github: '', leetcode: '', figma: '', linkedin: '' },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const [section, key] = e.target.name.split('.');
    if (section === 'links') {
      setProfile(prev => ({ ...prev, links: { ...prev.links, [key]: e.target.value } }));
    } else if (key === 'skills') {
      setProfile(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
    } else {
      setProfile(prev => ({ ...prev, [key]: e.target.value }));
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('bio', profile.bio);
    data.append('description', profile.description);
    data.append('skills', JSON.stringify(profile.skills));
    data.append('links', JSON.stringify(profile.links));
    if (file) data.append('profilePic', file);
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    try {
      const res = await axios.patch('/api/user/profile', data, config);
      setUser({ ...user, profile: res.data });
      setFile(null);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Error updating profile: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handlePublish = async () => {
    const username = prompt('Enter unique username');
    if (!username) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post('/api/portfolio/publish', { username }, config);
      setUser({ ...user, profile: { ...user.profile, publicUrl: res.data.publicUrl } });
      alert(`Public URL: ${window.location.origin}${res.data.publicUrl}`);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Build Your Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Bio" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <textarea name="description" value={profile.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input name="skills" value={profile.skills.join(', ')} onChange={handleChange} placeholder="Skills (comma separated)" className="p-2 border rounded md:col-span-2 focus:ring-2 focus:ring-blue-500" />
        <input name="links.github" value={profile.links.github} onChange={handleChange} placeholder="GitHub" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input name="links.leetcode" value={profile.links.leetcode} onChange={handleChange} placeholder="LeetCode" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input name="links.figma" value={profile.links.figma} onChange={handleChange} placeholder="Figma" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input name="links.linkedin" value={profile.links.linkedin} onChange={handleChange} placeholder="LinkedIn" className="p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Profile Picture</label>
          {profile.profilePic && <img src={profile.profilePic} alt="Profile" className="w-32 h-32 object-cover rounded-full mb-2" />}
          <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1" />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 mr-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
          Update Profile
        </button>
        <button onClick={handlePublish} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 focus:ring-2 focus:ring-purple-500">
          Publish Portfolio
        </button>
      </div>
    </div>
  );
};

export default PortfolioBuilder;