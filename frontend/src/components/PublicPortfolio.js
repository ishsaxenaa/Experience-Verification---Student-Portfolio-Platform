//frontend/src/components/PublicPortfolio.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from './ExperienceCard';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [data, setData] = useState({ user: { profile: { bio: '', description: '', profilePic: '', links: {}, skills: [] } }, experiences: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //const res = await axios.get(`/api/portfolio/${username}`);
        const res = await axios.get(`https://experience-verification-student.onrender.com/api/portfolio/${username}`);

        setData(res.data);
      } catch (err) {
        setError('Portfolio not found: ' + (err.response?.data?.error || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row items-center mb-8">
        {data.user.profile.profilePic && (
          <img src={data.user.profile.profilePic} alt="Profile" className="w-32 h-32 object-cover rounded-full mr-6 shadow-md" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.user.name}'s Portfolio</h1>
          <p className="text-gray-600">{data.user.profile.bio}</p>
          <p className="text-gray-500 mt-2">{data.user.profile.description}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {data.user.profile.skills.map((skill, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Links</h2>
      <div className="flex gap-4 mb-8">
        {Object.entries(data.user.profile.links).map(([key, url]) => url && (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline capitalize">{key}</a>
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.experiences
        .filter(exp => exp.status === "APPROVED" && exp.studentStatus === "ACCEPTED")
        .map(exp => (
        <ExperienceCard key={exp._id} exp={exp} role="public" />
        ))
        }
      </div>
    </div>
  );
};

export default PublicPortfolio;
