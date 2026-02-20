import React from 'react';

const OnLeaveCard = () => {
  const onLeave = [
    { name: 'Bhavani R.', initials: 'BR' },
    { name: 'Tarun K.', initials: 'TK' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">On Leave Today</h3>
      {onLeave.length > 0 ? (
        <div className="space-y-3">
          {onLeave.map((person, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">{person.initials}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">On Leave</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No one is on leave today</p>
      )}
    </div>
  );
};

export default OnLeaveCard;

