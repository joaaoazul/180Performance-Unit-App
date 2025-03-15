// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Sidebar, HeroSection } from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <HeroSection />
    </div>
  );
};

export default Dashboard;
