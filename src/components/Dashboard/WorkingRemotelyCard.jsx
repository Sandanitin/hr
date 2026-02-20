import React from 'react';
import { ComputerDesktopIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const WorkingRemotelyCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Remotely</h3>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <BuildingOfficeIcon className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-gray-700 font-semibold text-center mb-1">
          Everyone is at office!
        </p>
        <p className="text-gray-500 text-sm text-center">
          No one is working remotely today.
        </p>
      </div>
    </div>
  );
};

export default WorkingRemotelyCard;

