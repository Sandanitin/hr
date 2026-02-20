import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatusBadge from '../../components/Common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workHours, setWorkHours] = useState('0:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');

  // Load today's attendance from localStorage
  useEffect(() => {
    const savedAttendance = localStorage.getItem(`attendance_${today}`);
    if (savedAttendance) {
      const data = JSON.parse(savedAttendance);
      setCheckInTime(data.checkInTime);
      setCheckOutTime(data.checkOutTime);
      setWorkHours(data.workHours || '0:00');
      setCheckedIn(data.checkedIn || false);
      setLocation(data.location || '');
    }
  }, [today]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate work hours when checked in
  useEffect(() => {
    if (checkedIn && checkInTime) {
      const checkIn = new Date(`${today}T${checkInTime}`);
      const now = new Date();
      const diffMs = now - checkIn;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setWorkHours(`${diffHours}:${diffMinutes.toString().padStart(2, '0')}`);
    }
  }, [currentTime, checkedIn, checkInTime, today]);

  const leaveBalance = {
    accumulated: 6.0,
    earned: 1.25,
    casual: 0.5,
  };

  const recentLeaves = [
    { id: 1, type: 'Sick Leave', from: '2024-02-15', to: '2024-02-16', days: 2, status: 'approved' },
    { id: 2, type: 'Vacation', from: '2024-02-20', to: '2024-02-22', days: 3, status: 'pending' },
  ];

  const handleCheckIn = () => {
    const now = new Date();
    const time12Hour = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    setCheckedIn(true);
    setCheckInTime(time12Hour);
    
    // Get user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        },
        () => {
          setLocation('Office');
        }
      );
    }

    // Save to localStorage
    const attendanceData = {
      checkInTime: time12Hour,
      checkedIn: true,
      workHours: '0:00',
      location: location || 'Office',
      date: today,
    };
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceData));
    
    toast.success(`Checked in at ${time12Hour}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const time12Hour = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    setCheckOutTime(time12Hour);
    setCheckedIn(false);

    // Calculate final work hours
    if (checkInTime) {
      const saved = localStorage.getItem(`attendance_${today}`);
      if (saved) {
        const data = JSON.parse(saved);
        const checkIn24 = data.checkInTime24 || checkInTime;
        const checkInDate = new Date(`${today}T${checkIn24}`);
        const checkOutDate = new Date(`${today}T${now.toLocaleTimeString('en-US', { hour12: false })}`);
        const diffMs = checkOutDate - checkInDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const finalHours = `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
        setWorkHours(finalHours);

        data.checkOutTime = time12Hour;
        data.checkedIn = false;
        data.workHours = finalHours;
        localStorage.setItem(`attendance_${today}`, JSON.stringify(data));
      }
    }
    
    toast.success(`Checked out at ${time12Hour}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-purple-100">Here's your profile summary</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-purple-200">Employee ID</p>
              <p className="text-lg font-semibold">EMP001</p>
            </div>
            <div>
              <p className="text-sm text-purple-200">Department</p>
              <p className="text-lg font-semibold">Engineering</p>
            </div>
            <div>
              <p className="text-sm text-purple-200">Position</p>
              <p className="text-lg font-semibold">Developer</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balance Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Leave Balance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Accumulated</span>
                  <span className="text-sm font-semibold text-gray-900">{leaveBalance.accumulated} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Earned Leave</span>
                  <span className="text-sm font-semibold text-gray-900">{leaveBalance.earned} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Casual Leave</span>
                  <span className="text-sm font-semibold text-gray-900">{leaveBalance.casual} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Today Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ClockIcon className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Attendance Today</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Current Time</p>
                <p className="text-sm font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 rounded-lg ${checkedIn ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">Check In</p>
                  <p className={`text-lg font-bold ${checkInTime ? 'text-green-600' : 'text-gray-400'}`}>
                    {checkInTime || '--:--'}
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg ${checkOutTime ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">Check Out</p>
                  <p className={`text-lg font-bold ${checkOutTime ? 'text-blue-600' : 'text-gray-400'}`}>
                    {checkOutTime || '--:--'}
                  </p>
                </div>
              </div>
              {checkedIn && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Work Hours</p>
                  <p className="text-xl font-bold text-purple-600">{workHours}</p>
                  <p className="text-xs text-purple-600 mt-1">Live tracking...</p>
                </div>
              )}
              {location && (
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  {location}
                </div>
              )}
              <div className="pt-2">
                {!checkedIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Check In Now
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Check Out Now
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payslip Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <DocumentArrowDownIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Payslips</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">February 2024</p>
                  <p className="text-sm text-gray-500">Salary Slip</p>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Download
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">January 2024</p>
                  <p className="text-sm text-gray-500">Salary Slip</p>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leave Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Leave Status</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={leave.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;

