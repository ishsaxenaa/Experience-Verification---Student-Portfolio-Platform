
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentDashboard = ({ token, logout }) => {
  const [user, setUser] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [pendingExp, setPendingExp] = useState([]);
  const [profile, setProfile] = useState({
    bio: '',
    skills: [],
    github: '',
    leetcode: '',
    figma: '',
    linkedin: '',
    customUrl: '',
    isPublic: false,
    profilePic: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedExp, setExpandedExp] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [userRes, expRes] = await Promise.all([
          axios.get('/api/user/me', config),
          axios.get('/api/experience/student', config),
        ]);
        setUser(userRes.data);
        const allExp = expRes.data;
        console.log('Fetched experiences:', allExp.map(exp => ({
          _id: exp._id,
          activityName: exp.activityName,
          status: exp.status,
          studentStatus: exp.studentStatus,
        })));
        // Filter for "My Experiences": status APPROVED and studentStatus ACCEPTED (or undefined)
        const myExperiences = allExp.filter((exp) => exp.status === 'APPROVED' && (exp.studentStatus === 'ACCEPTED' || exp.studentStatus === undefined));
        console.log('My Experiences:', myExperiences);
        setExperiences(myExperiences);
        // Filter for "Pending Experiences": status APPROVED and studentStatus PENDING
        const pendingExperiences = allExp.filter((exp) => exp.status === 'APPROVED' && exp.studentStatus === 'PENDING');
        console.log('Pending Experiences:', pendingExperiences);
        setPendingExp(pendingExperiences);
        const fetchedProfile = {
          bio: userRes.data.profile?.bio || '',
          skills: Array.isArray(userRes.data.profile?.skills) ? userRes.data.profile.skills : [],
          github: userRes.data.profile?.links?.github || '',
          leetcode: userRes.data.profile?.links?.leetcode || '',
          figma: userRes.data.profile?.links?.figma || '',
          linkedin: userRes.data.profile?.links?.linkedin || '',
          customUrl: userRes.data.profile?.publicUrl || '',
          isPublic: userRes.data.profile?.isPublic || false,
          profilePic: userRes.data.profile?.profilePic || '',
        };
        console.log('Fetched profile:', fetchedProfile);
        setProfile(fetchedProfile);
        if (userRes.data.profile?.profilePic) {
          setPreview(`http://localhost:5001${userRes.data.profile?.profilePic}`);
        }
      } catch (err) {
        console.error('Fetch data error:', err.response || err);
        alert('Error fetching data: ' + (err.response?.data?.error || err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAction = async (id, action) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      console.log(`Performing ${action} on experience ID: ${id}`);
      await axios.post(`/api/experience/${id}/${action}`, {}, config);
      const res = await axios.get('/api/experience/student', config);
      const allExp = res.data;
      console.log('Updated experiences:', allExp.map(exp => ({
        _id: exp._id,
        activityName: exp.activityName,
        status: exp.status,
        studentStatus: exp.studentStatus,
      })));
      setExperiences(allExp.filter((exp) => exp.status === 'APPROVED' && (exp.studentStatus === 'ACCEPTED' || exp.studentStatus === undefined)));
      setPendingExp(allExp.filter((exp) => exp.status === 'APPROVED' && exp.studentStatus === 'PENDING'));
    } catch (err) {
      console.error('Action error:', err.response || err);
      alert('Error: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    }
  };

  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPublicUrl = (url) => {
    if (!url) return true;
    return /^[a-zA-Z0-9-_]+$/.test(url);
  };

  const handleSaveProfile = async () => {
    try {
      setUploading(true);

      const linksObject = {
        github: profile.github || '',
        leetcode: profile.leetcode || '',
        figma: profile.figma || '',
        linkedin: profile.linkedin || '',
      };

      // Input validation
      for (const [key, value] of Object.entries(linksObject)) {
        if (value && !isValidUrl(value)) {
          alert(`Invalid ${key} URL. Please enter a valid URL or leave it empty.`);
          setUploading(false);
          return;
        }
      }

      if (profile.customUrl && !isValidPublicUrl(profile.customUrl)) {
        alert('Invalid custom URL. Use only alphanumeric characters, hyphens, or underscores.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('bio', profile.bio || '');
      formData.append('skills', JSON.stringify(profile.skills || []));
      formData.append('links', JSON.stringify(linksObject));
      formData.append('publicUrl', profile.customUrl || '');
      // Append isPublic flag to FormData
      formData.append('isPublic', String(profile.isPublic));

      if (profilePic && profilePic instanceof File) {
        formData.append('profilePic', profilePic);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Use a single patch request to update all profile fields, including publicUrl and isPublic
      const res = await axios.patch('/api/user/profile', formData, config);
      console.log('Profile update response:', res.data);

      if (res.data.profilePic) {
        setPreview(`http://localhost:5001${res.data.profilePic}`);
      }

      alert('Profile updated successfully');

      const userRes = await axios.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
      const updatedProfile = {
        bio: userRes.data.profile?.bio || '',
        skills: Array.isArray(userRes.data.profile?.skills) ? userRes.data.profile.skills : [],
        github: userRes.data.profile?.links?.github || '',
        leetcode: userRes.data.profile?.links?.leetcode || '',
        figma: userRes.data.profile?.links?.figma || '',
        linkedin: userRes.data.profile?.links?.linkedin || '',
        customUrl: userRes.data.profile?.publicUrl || '',
        isPublic: userRes.data.profile?.isPublic || false,
        profilePic: userRes.data.profile?.profilePic || '',
      };
      console.log('Updated profile:', updatedProfile);
      setUser(userRes.data);
      setProfile(updatedProfile);
      setProfilePic(null);
      setIsEditing(false);

    } catch (err) {
      console.error('Profile update error:', err.response?.data || err);
      alert('Error: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(inputValue.trim())) {
        setProfile((prev) => ({
          ...prev,
          skills: [...prev.skills, inputValue.trim()],
        }));
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Invalid file type. Only JPEG, PNG, or GIF allowed.');
        return;
      }
      console.log('Selected file:', file.name, file.type, file.size);
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const publishPortfolio = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post('/api/portfolio/publish', { username: profile.customUrl }, config);
      setProfile((prev) => ({
        ...prev,
        customUrl: res.data.publicUrl.replace('/portfolio/', ''),
        isPublic: true,
      }));
      alert('Portfolio published!');
    } catch (err) {
      console.error('Publish portfolio error:', err.response || err);
      alert('Error: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    }
  };

  const toggleFeatured = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      console.log(`Toggling featured for experience ID: ${id}`);
      await axios.patch(`/api/experience/${id}/feature`, {}, config);
      const res = await axios.get('/api/experience/student', config);
      const allExp = res.data;
      console.log('Updated experiences after feature toggle:', allExp.map(exp => ({
        _id: exp._id,
        activityName: exp.activityName,
        status: exp.status,
        studentStatus: exp.studentStatus,
      })));
      setExperiences(allExp.filter((exp) => exp.status === 'APPROVED' && (exp.studentStatus === 'ACCEPTED' || exp.studentStatus === undefined)));
      setPendingExp(allExp.filter((exp) => exp.status === 'APPROVED' && exp.studentStatus === 'PENDING'));
    } catch (err) {
      console.error('Toggle featured error:', err.response || err);
      alert('Error: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-blue-600">ExperienceHub</div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <span className="text-gray-700">{user?.name}</span>
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-sm font-semibold">Total Experiences</h3>
            <p className="text-3xl font-bold">{experiences.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-sm font-semibold">Pending Review</h3>
            <p className="text-3xl font-bold">{pendingExp.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-sm font-semibold">Achievements</h3>
            <p className="text-3xl font-bold">
              {experiences.filter((exp) => exp.achievementLevel === 'Winner').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-sm font-semibold">Profile Views</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Pending Experiences</h2>
          {pendingExp.length === 0 ? (
            <p className="text-gray-500">No pending experiences.</p>
          ) : (
            <div className="space-y-4">
              {pendingExp.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{exp.activityName}</h3>
                  <p className="text-gray-600">Submitted by: {exp.orgId?.name || 'Unknown Org'}</p>
                  <p className="text-gray-500 text-sm">
                    {exp.description.substring(0, 100)}...
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(exp.date).toLocaleDateString()} | {exp.category}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAction(exp._id, 'accept')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(exp._id, 'decline')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setExpandedExp(exp._id)}
                      className="border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
                    >
                      View Details
                    </button>
                  </div>
                  {expandedExp === exp._id && (
                    <div className="mt-2 bg-gray-50 p-2 rounded">
                      <p>
                        <strong>Description:</strong> {exp.description}
                      </p>
                      <p>
                        <strong>Documents:</strong> {exp.documents?.map((doc, idx) => (
                          <a
                            key={idx}
                            href={`http://localhost:5001${doc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800"
                          >
                            Document {idx + 1}
                          </a>
                        )) || 'None'}
                      </p>
                      <p>
                        <strong>Status:</strong> {exp.status} {exp.studentStatus ? `| Student Response: ${exp.studentStatus}` : ''}
                      </p>
                      <button
                        onClick={() => setExpandedExp(null)}
                        className="text-red-500 mt-2"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Experiences</h2>
          {experiences.length === 0 ? (
            <p className="text-gray-500">No verified experiences yet.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.activityName}</h3>
                      <p className="text-gray-600">Organization: {exp.orgId?.name || 'Unknown Org'}</p>
                      <p className="text-gray-500 text-sm">
                        {exp.description.substring(0, 100)}...
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFeatured(exp._id)}
                      className="text-yellow-500 text-2xl"
                    >
                      {exp.featured ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Verified
                    </span>
                    {exp.studentStatus && (
                      <span className={`px-2 py-1 text-xs rounded-full ${exp.studentStatus === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : exp.studentStatus === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {exp.studentStatus}
                      </span>
                    )}
                    {exp.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <label htmlFor="profilePic" className="cursor-pointer">
                <img
                  src={preview || '/assets/user.png'}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border"
                  onError={(e) => {
                    console.error('Image load error:', profile.profilePic);
                    e.target.src = '/assets/user.png';
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                disabled={uploading || !isEditing}
                onChange={handlePicChange}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.email}</p>

            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Add a bio..."
              className="w-full border-gray-300 p-2 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />

            <div className="mt-4 text-left">
              <h4 className="text-sm font-semibold text-gray-700">Skills</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} className="ml-1 text-xs">
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Add skill..."
                    className="border-gray-300 p-1 rounded focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 text-left">
              <h4 className="text-sm font-semibold text-gray-700">Links</h4>
              <input
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="GitHub URL"
                className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
              <input
                value={profile.leetcode}
                onChange={(e) => setProfile({ ...profile, leetcode: e.target.value })}
                placeholder="LeetCode URL"
                className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
              <input
                value={profile.figma}
                onChange={(e) => setProfile({ ...profile, figma: e.target.value })}
                placeholder="Figma URL"
                className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
              <input
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="LinkedIn URL"
                className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
            </div>

            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
                disabled={uploading}
              >
                Save Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Portfolio Settings
            </h4>

            {/* Custom URL Input */}
            <input
              type="text"
              value={profile.customUrl}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, customUrl: e.target.value }))
              }
              placeholder="Custom Portfolio URL (e.g., isha123)"
              className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={profile.isPublic}
            />

            {/* Public Portfolio Toggle */}
            <label className="flex items-center mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isPublic}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, isPublic: e.target.checked }))
                }
                className="mr-2"
                disabled={!isEditing}
              />
              <span className="text-gray-700">Make Portfolio Public</span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {/* Publish Button (Shown only when not public) */}
              {!profile.isPublic && (
                <button
                  onClick={publishPortfolio}
                  disabled={uploading || !profile.customUrl}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg 
                            hover:bg-green-600 transition disabled:opacity-50"
                >
                  Publish Portfolio
                </button>
              )}
            </div>

            {/* Shareable URL Section (Shown only when published) */}
            {profile.isPublic && (
              <div className="mt-6 border-t pt-4">
                <h5 className="text-md font-semibold text-gray-700">
                  Shareable URL
                </h5>
                <a
                  href={profile.customUrl.startsWith('/portfolio/') ? profile.customUrl : `/portfolio/${profile.customUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition"
                >
                  View Your Public Portfolio
                </a>
                <p className="text-sm text-gray-500 mt-2 break-all">
                  Your URL: <span className="font-mono">http://localhost:3000{profile.customUrl.startsWith('/portfolio/') ? profile.customUrl : `/portfolio/${profile.customUrl}`}</span>
                </p>
              </div>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;
