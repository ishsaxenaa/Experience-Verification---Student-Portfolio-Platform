import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ExperienceHub</div>
          <div className="space-x-4">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login</Link>
            <Link to="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Verify & Showcase Your Experiences
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Empower your career with a platform to validate experiences and build a stunning portfolio.
        </p>
        <div className="space-x-4">
          <Link to="/login" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"> Get Started  </Link>
          <a href="#how-it-works" className="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition duration-300">Learn More</a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-100">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">How ExperienceHub Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Organizations Submit */}
          <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img
              src="/assets/submit.png"
              alt="Organizations Submit Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Organizations Submit</h3>
            <p className="text-gray-600">
              Organizations upload experiences with details and supporting documents for verification.
            </p>
          </div>
          {/* Step 2: Students Accept */}
          <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img
              src="/assets/accept.png"
              alt="Students Accept Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Students Accept</h3>
            <p className="text-gray-600">
              Students review and accept or decline experiences, updating their status accordingly.
            </p>
          </div>
          {/* Step 3: Portfolios Shine */}
          <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img
              src="/assets/portfolio.png"
              alt="Portfolios Shine Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Portfolios Shine</h3>
            <p className="text-gray-600">
              Build and share a professional portfolio with verified experiences to showcase your skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
