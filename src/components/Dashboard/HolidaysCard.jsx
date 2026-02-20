import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

const HolidaysCard = () => {
  const holidays = [
    { name: 'Ugadi (Telugu/Kannada)', date: 'Thu, 11 March, 2025' },
    { name: 'Holi', date: 'Fri, 14 March, 2025' },
    { name: 'Good Friday', date: 'Fri, 18 April, 2025' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Holidays</h3>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>
      <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
        <div className="relative">
          <div className="flex items-start space-x-3">
            <CalendarIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{holidays[0].name}</p>
              <p className="text-sm text-gray-600 mt-1">{holidays[0].date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaysCard;

