import React from 'react';
import Navbar from '../components/Navbar';
import ActivityTabs from '../components/ActivityTabs';

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ActivityTabs />
    </div>
  );
};

export default ActivityPage;