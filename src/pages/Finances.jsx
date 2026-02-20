import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Finances = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Finances</h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600">Finances page coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Finances;

