import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './components/StudentDashboard';
import OrgDashboard from './components/OrgDashboard';
import PublicPortfolio from './components/PublicPortfolio';
import LandingPage from './components/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route
            path="/student-dashboard"
            element={token ? <StudentDashboard token={token} logout={logout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/org-dashboard"
            element={token ? <OrgDashboard token={token} logout={logout} /> : <Navigate to="/login" replace />}
          />
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;