import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserIcon,
  InboxIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOffice2Icon,
  UsersIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  InboxIcon as InboxIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  HeartIcon as HeartIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CalendarIcon as CalendarIconSolid,
  ClockIcon as ClockIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  UsersIcon as UsersIconSolid,
  DocumentChartBarIcon as DocumentChartBarIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const { user } = useAuth();

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Home', icon: HomeIcon, iconSolid: HomeIconSolid },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...commonItems,
        { path: '/admin/users', label: 'Users', icon: UsersIcon, iconSolid: UsersIconSolid },
        { path: '/admin/reports', label: 'Reports', icon: DocumentChartBarIcon, iconSolid: DocumentChartBarIconSolid },
        { path: '/hr/calendar', label: 'Calendar', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/hr/payroll', label: 'Payroll', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
        { path: '/hr/pf', label: 'Provident Fund', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
        { path: '/hr/employees', label: 'Employees', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
        { path: '/hr/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
      ];
    } else if (user?.role === 'HR') {
      return [
        ...commonItems,
        { path: '/hr/employees', label: 'Employees', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
        { path: '/hr/leaves', label: 'Leave Approvals', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/hr/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/hr/calendar', label: 'Calendar', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/hr/pf', label: 'Provident Fund', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
        { path: '/hr/payroll', label: 'Payroll', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
      ];
    } else {
      // Employee
      return [
        ...commonItems,
        { path: '/employee/profile', label: 'My Profile', icon: UserIcon, iconSolid: UserIconSolid },
        { path: '/leave', label: 'Leave Management', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/finances', label: 'My Finances', icon: CurrencyDollarIcon, iconSolid: CurrencyDollarIconSolid },
      ];
    }
  };

  const menuItems = getMenuItems();
  return (
    <div className="w-64 bg-gradient-to-b from-purple-700 to-purple-800 h-screen fixed left-0 top-0 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-purple-600">
        <h1 className="text-3xl font-bold text-white">vikrin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const IconSolid = item.iconSolid;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-white hover:bg-purple-600 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <IconSolid className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

