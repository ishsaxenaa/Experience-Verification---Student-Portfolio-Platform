//frontend/src/components/ExperienceCard.js
import React, { useState } from 'react';
import Modal from './Modal';

const ExperienceCard = ({ exp, onAccept, onDecline, onToggleFeatured, role }) => {
  const [showDetails, setShowDetails] = useState(false);

  const isImage = (doc) => /\.(jpg|jpeg|png|gif)$/i.test(doc);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-900">{exp.activityName}</h2>
        {role === 'student' && (
          <button onClick={() => onToggleFeatured(exp._id)} className="text-yellow-500 hover:text-yellow-600">
            ★ {/* Simple star character */}
          </button>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-2">{new Date(exp.date).toLocaleDateString()}</p>
      <p className="text-gray-700 mb-4">{exp.description.substring(0, 100)}...</p>
      <span className={`px-3 py-1 text-sm rounded-full ${exp.status === 'APPROVED' ? 'bg-green-100 text-green-800' : exp.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {exp.status}
      </span>
      {role === 'student' && exp.status === 'PENDING' && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => onAccept(exp._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Accept</button>
          <button onClick={() => onDecline(exp._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
        </div>
      )}
      <button onClick={() => setShowDetails(true)} className="mt-4 text-blue-500 hover:underline flex items-center">
        Learn More 
      </button>
      <div className="mt-4">
        {exp.documents.map((doc, idx) => (
          <div key={idx} className="mb-2">
            {isImage(doc) ? (
              <img src={`https://experience-verification-student.onrender.com/api/documents/${doc.split('/').pop()}`} alt={`Document ${idx + 1}`} className="w-full h-auto rounded" />
            ) : (
              <a 
              href={`https://experience-verification-student.onrender.com/api/documents/${doc.split('/').pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover: underline flex items-center"
                View Document {idx + 1}
              </a>
            )}
          </div>
        ))}
      </div>
      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title={exp.activityName}>
        <p className="text-gray-700">{exp.description}</p>
        <p className="mt-2"><strong>Achievement Level:</strong> {exp.achievementLevel}</p>
        <p><strong>Date:</strong> {new Date(exp.date).toLocaleDateString()}</p>
        <p><strong>Organization:</strong> {exp.orgId?.name}</p>
      </Modal>
    </div>
  );
};

export default ExperienceCard;
