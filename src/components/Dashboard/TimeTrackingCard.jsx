import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const TimeTrackingCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Time Today</h3>
        <button className="text-sm text-purple-100 hover:text-white font-medium">
          View All
        </button>
      </div>
      <div className="mb-4">
        <p className="text-purple-200 text-sm mb-2">{formatDate(currentTime)}</p>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-5 h-5" />
          <p className="text-3xl font-bold">{formatTime(currentTime)}</p>
        </div>
      </div>
      <button
        onClick={() => setIsTracking(!isTracking)}
        className={`w-full py-2.5 rounded-lg font-semibold transition ${
          isTracking
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-white text-purple-600 hover:bg-purple-50'
        }`}
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>
    </div>
  );
};

export default TimeTrackingCard;

