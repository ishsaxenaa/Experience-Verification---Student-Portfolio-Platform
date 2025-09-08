import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard';

const PortfolioPage = () => {
  const { username } = useParams();
  const [data, setData] = useState({ user: {}, experiences: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
      setData(res.data);
    };
    fetchData();
  }, [username]);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">{data.user.name}'s Portfolio</h1>
      <p>{data.user.profile.bio}</p>
      <ul className="list-disc mb-4">
        {data.user.profile.skills.map(skill => <li key={skill}>{skill}</li>)}
      </ul>
      <div className="mb-4">
        Links: 
        {Object.entries(data.user.profile.links).map(([key, url]) => url && <a key={key} href={url} className="ml-2 text-blue-500">{key}</a>)}
      </div>
      <h2 className="text-2xl mb-2">Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.experiences.map(exp => <ExperienceCard key={exp._id} exp={exp} role="public" />)}
      </div>
    </div>
  );
};

export default PortfolioPage;