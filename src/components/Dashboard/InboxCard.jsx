import React from 'react';
import { InboxIcon } from '@heroicons/react/24/outline';

const InboxCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inbox</h3>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <InboxIcon className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-gray-700 font-medium text-center">
          Good job! You have no pending actions.
        </p>
      </div>
    </div>
  );
};

export default InboxCard;

