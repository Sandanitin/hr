import React from 'react';

const LeaveBalancesCard = () => {
  const leaveTypes = [
    { name: 'Accumulated', days: 6.0, color: 'blue' },
    { name: 'Earned Leave', days: 1.25, color: 'green' },
    { name: 'Casual Leave', days: 0.5, color: 'purple' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
    };
    return colors[color] || colors.blue;
  };

  const getBgColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {leaveTypes.map((leave, index) => (
          <div key={index} className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full ${getBgColorClasses(leave.color)} flex items-center justify-center mb-2`}>
              <span className={`text-2xl font-bold ${getColorClasses(leave.color).split(' ')[1]}`}>
                {leave.days}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium">{leave.name}</p>
            <p className="text-xs text-gray-500 mt-1">Days</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition">
          Request Leave
        </button>
        <button className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition">
          View All Balances
        </button>
      </div>
    </div>
  );
};

export default LeaveBalancesCard;

