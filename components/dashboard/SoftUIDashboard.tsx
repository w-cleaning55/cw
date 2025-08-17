"use client";

import React from 'react';

interface SoftUIDashboardProps {
  children?: React.ReactNode;
}

const SoftUIDashboard: React.FC<SoftUIDashboardProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        {children}
      </div>
    </div>
  );
};

export default SoftUIDashboard;
