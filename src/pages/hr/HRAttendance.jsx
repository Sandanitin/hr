import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import { CalendarIcon, ClockIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HRAttendance = () => {
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('today'); // today, week, month

  const [attendance, setAttendance] = useState([
    { id: 1, employee: 'John Doe', employeeId: 'EMP001', department: 'Engineering', date: '2024-03-01', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '8:30', status: 'present' },
    { id: 2, employee: 'Jane Smith', employeeId: 'EMP002', department: 'HR', date: '2024-03-01', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: '8:30', status: 'present' },
    { id: 3, employee: 'Bob Wilson', employeeId: 'EMP003', department: 'Sales', date: '2024-03-01', checkIn: '--', checkOut: '--', hours: '0:00', status: 'absent' },
    { id: 4, employee: 'Alice Johnson', employeeId: 'EMP004', department: 'Marketing', date: '2024-03-01', checkIn: '09:30 AM', checkOut: '02:00 PM', hours: '4:30', status: 'half-day' },
    { id: 5, employee: 'Charlie Brown', employeeId: 'EMP005', department: 'Engineering', date: '2024-03-01', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '8:30', status: 'present' },
  ]);

  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

  const attendanceColumns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Department', accessor: 'department' },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Hours', accessor: 'hours' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => {
        const colors = {
          present: 'bg-green-100 text-green-800',
          absent: 'bg-red-100 text-red-800',
          'half-day': 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
          </span>
        );
      },
    },
  ];

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const halfDayCount = attendance.filter(a => a.status === 'half-day').length;
  const totalHours = attendance.reduce((sum, a) => {
    const [hours, minutes] = a.hours.split(':').map(Number);
    return sum + hours + minutes / 60;
  }, 0);

  const handleManualEntry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEntry = {
      id: attendance.length + 1,
      employee: formData.get('employee'),
      employeeId: formData.get('employeeId'),
      department: formData.get('department'),
      date: formData.get('date'),
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      hours: formData.get('hours'),
      status: formData.get('status'),
    };
    setAttendance([...attendance, newEntry]);
    toast.success('Attendance entry added successfully!');
    setShowManualEntryModal(false);
  };

  const handleExport = () => {
    toast.success('Attendance report exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowManualEntryModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Manual Entry
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Present Today</p>
                <p className="text-3xl font-bold text-green-600">{presentCount}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">{absentCount}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Half Day</p>
                <p className="text-3xl font-bold text-yellow-600">{halfDayCount}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                <p className="text-3xl font-bold text-purple-600">{totalHours.toFixed(1)}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex space-x-2">
            {['today', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employee name or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <DataTable
          columns={attendanceColumns}
          data={filteredAttendance}
        />
      </div>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={showManualEntryModal}
        onClose={() => setShowManualEntryModal(false)}
        title="Manual Attendance Entry"
        size="md"
      >
        <form onSubmit={handleManualEntry} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
            <input
              type="text"
              name="employee"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              name="date"
              defaultValue={selectedDate}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check In *</label>
              <input
                type="time"
                name="checkIn"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
              <input
                type="time"
                name="checkOut"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours</label>
              <input
                type="text"
                name="hours"
                placeholder="8:30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowManualEntryModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Entry
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default HRAttendance;



