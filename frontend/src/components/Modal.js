import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-6 bg-red-500 text-white p-2 w-full rounded hover:bg-red-600">Close</button>
      </div>
    </div>
  );
};

export default Modal;