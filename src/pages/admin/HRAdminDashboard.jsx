import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const HRAdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Total Employees',
      value: '156',
      icon: UserGroupIcon,
      color: 'blue',
      link: '/hr/employees'
    },
    {
      label: 'Pending Leaves',
      value: '12',
      icon: CalendarIcon,
      color: 'orange',
      link: '/hr/leaves'
    },
    {
      label: 'Attendance Today',
      value: '142',
      icon: ClockIcon,
      color: 'green',
      link: '/hr/attendance'
    },
    {
      label: 'Payroll Processed',
      value: '98%',
      icon: ChartBarIcon,
      color: 'purple',
      link: '/hr/payroll'
    },
  ];

  const recentActivities = [
    { id: 1, text: 'John Doe checked in at 9:00 AM', time: '2 hours ago', type: 'attendance' },
    { id: 2, text: 'Jane Smith requested Sick Leave', time: '3 hours ago', type: 'leave' },
    { id: 3, text: 'New employee onboarding completed', time: '5 hours ago', type: 'onboarding' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              orange: 'bg-orange-100 text-orange-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            return (
              <div
                key={index}
                onClick={() => navigate(stat.link)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 hover:text-purple-600">
                  View Details <ArrowRightIcon className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/hr/employees')}
                className="p-4 rounded-lg bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition flex flex-col items-center justify-center text-gray-700 font-medium border border-gray-200 hover:border-purple-200"
              >
                <UserGroupIcon className="w-8 h-8 mb-2" />
                Add Employee
              </button>
              <button
                onClick={() => navigate('/hr/leaves')}
                className="p-4 rounded-lg bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition flex flex-col items-center justify-center text-gray-700 font-medium border border-gray-200 hover:border-purple-200"
              >
                <CalendarIcon className="w-8 h-8 mb-2" />
                Approve Leaves
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 mr-3"></div>
                  <div>
                    <p className="text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRAdminDashboard;
