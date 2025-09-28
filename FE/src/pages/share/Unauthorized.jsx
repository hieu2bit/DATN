import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLock, AiOutlineHome, AiOutlineArrowLeft } from 'react-icons/ai';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AiOutlineLock className="text-red-500 text-5xl" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <AiOutlineHome className="text-lg" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
          >
            <AiOutlineArrowLeft className="text-lg" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        If you need assistance, please contact support.
      </p>
    </div>
  );
};

export default Unauthorized;