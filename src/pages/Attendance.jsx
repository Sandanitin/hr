import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { ClockIcon, CalendarIcon, ArrowDownTrayIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workHours, setWorkHours] = useState('0:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);

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
      setNotes(data.notes || '');
    }

    // Load attendance history
    const history = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const saved = localStorage.getItem(`attendance_${dateStr}`);
      if (saved) {
        history.push({ ...JSON.parse(saved), date: dateStr });
      }
    }
    setAttendanceHistory(history);
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

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const attendanceData = [
    { date: 1, status: 'present', hours: '8:30' },
    { date: 2, status: 'present', hours: '8:15' },
    { date: 3, status: 'present', hours: '8:45' },
    { date: 4, status: 'absent', hours: '0:00' },
    { date: 5, status: 'present', hours: '8:20' },
    { date: 6, status: 'half-day', hours: '4:30' },
    { date: 7, status: 'present', hours: '8:00' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'half-day':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
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
          setLocation('Location not available');
        }
      );
    }

    // Save to localStorage
    const attendanceData = {
      checkInTime: time12Hour,
      checkInTime24: timeString,
      checkedIn: true,
      workHours: '0:00',
      location: location || 'Office',
      notes: notes,
      date: today,
    };
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceData));

    toast.success(`Checked in at ${time12Hour}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const time12Hour = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    setCheckOutTime(time12Hour);
    setCheckedIn(false);

    // Calculate final work hours
    if (checkInTime) {
      const checkIn24 = localStorage.getItem(`attendance_${today}`)
        ? JSON.parse(localStorage.getItem(`attendance_${today}`)).checkInTime24
        : null;

      if (checkIn24) {
        const checkInDate = new Date(`${today}T${checkIn24}`);
        const checkOutDate = new Date(`${today}T${timeString}`);
        const diffMs = checkOutDate - checkInDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const finalHours = `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
        setWorkHours(finalHours);

        // Save to localStorage
        const attendanceData = {
          checkInTime: checkInTime,
          checkInTime24: checkIn24,
          checkOutTime: time12Hour,
          checkOutTime24: timeString,
          checkedIn: false,
          workHours: finalHours,
          location: location || 'Office',
          notes: notes,
          date: today,
        };
        localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceData));

        // Update history
        const history = [...attendanceHistory];
        const existingIndex = history.findIndex(h => h.date === today);
        if (existingIndex >= 0) {
          history[existingIndex] = attendanceData;
        } else {
          history.unshift(attendanceData);
        }
        setAttendanceHistory(history);
      }
    }

    toast.success(`Checked out at ${time12Hour}. Work hours: ${workHours}`);
  };

  const handleExport = () => {
    toast.success('Attendance report exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-1">Track your daily attendance and work hours</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>

        {/* Today's Attendance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Today's Attendance</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`text-center p-6 rounded-lg transition ${checkedIn ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-600 mb-2">Check In</p>
              <p className={`text-2xl font-bold ${checkInTime ? 'text-green-600' : 'text-gray-400'}`}>
                {checkInTime || '--:--:--'}
              </p>
              {location && (
                <p className="text-xs text-gray-500 mt-2 flex items-center justify-center">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  {location}
                </p>
              )}
            </div>
            <div className={`text-center p-6 rounded-lg transition ${checkOutTime ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-600 mb-2">Check Out</p>
              <p className={`text-2xl font-bold ${checkOutTime ? 'text-blue-600' : 'text-gray-400'}`}>
                {checkOutTime || '--:--:--'}
              </p>
            </div>
            <div className={`text-center p-6 rounded-lg transition ${checkedIn ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-600 mb-2">Work Hours</p>
              <p className={`text-2xl font-bold ${checkedIn ? 'text-purple-600 animate-pulse' : 'text-gray-900'}`}>
                {workHours}
              </p>
              {checkedIn && (
                <p className="text-xs text-purple-600 mt-2">Live tracking...</p>
              )}
            </div>
          </div>

          {/* Check In/Out Button */}
          <div className="flex flex-col items-center space-y-4">
            {!checkedIn ? (
              <div className="w-full max-w-md">
                <button
                  onClick={handleCheckIn}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 mr-2" />
                    Check In Now
                  </div>
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Click to record your check-in time
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <button
                  onClick={handleCheckOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 mr-2" />
                    Check Out Now
                  </div>
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Work hours: {workHours} | Click to check out
                </p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          {checkedIn && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  const saved = localStorage.getItem(`attendance_${today}`);
                  if (saved) {
                    const data = JSON.parse(saved);
                    data.notes = e.target.value;
                    localStorage.setItem(`attendance_${today}`, JSON.stringify(data));
                  }
                }}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add any notes about your work today..."
              />
            </div>
          )}
        </div>

        {/* Recent Attendance History */}
        {attendanceHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceHistory.slice(0, 7).map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkInTime || '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOutTime || '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{record.workHours || '0:00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.checkOutTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {record.checkOutTime ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Calendar View */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance - {currentMonth}</h2>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-16"></div>;
              }
              const attendance = attendanceData.find((a) => a.date === day);
              return (
                <div
                  key={index}
                  className={`h-16 border border-gray-200 rounded-lg p-2 flex flex-col items-center justify-center ${attendance ? getStatusColor(attendance.status) : 'bg-white'
                    }`}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {attendance && (
                    <span className="text-xs mt-1">{attendance.hours}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Half Day</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;

