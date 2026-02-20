import React from 'react';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

const PraiseCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Praise</h3>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <HandRaisedIcon className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 text-center">Give praise from here</p>
        <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition">
          Give Praise
        </button>
      </div>
    </div>
  );
};

export default PraiseCard;

