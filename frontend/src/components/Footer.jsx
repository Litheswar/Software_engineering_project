import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Campus Exchange</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted marketplace for buying and selling within your campus community. 
              Safe, verified, and student-focused.
            </p>
            <div className="flex space-x-4">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Verified Students Only
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Admin Approved
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/post" className="text-gray-300 hover:text-white transition-colors">
                  Sell Items
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/activity" className="text-gray-300 hover:text-white transition-colors">
                  My Activity
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Campus Exchange. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        
        {/* Campus Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built for students, by students. Making campus life more connected.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;