import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Campus Exchange
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/post" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Post
            </Link>
            <Link to="/activity" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Activity
            </Link>
            <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;