import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  CalendarIcon as CalendarIconSolid,
  ClockIcon as ClockIconSolid,
  UsersIcon as UsersIconSolid,
  DocumentChartBarIcon as DocumentChartBarIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        { path: '/hr/employees', label: 'Employees', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
        { path: '/hr/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/hr/leaves', label: 'Leave Approvals', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/hr/payroll', label: 'Payroll', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
        { path: '/hr/pf', label: 'Provident Fund', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
        { path: '/hr/calendar', label: 'Calendar', icon: CalendarIcon, iconSolid: CalendarIconSolid },
      ];
    } else if (user?.role === 'HR') {
      return [
        ...commonItems,
        { path: '/hr/employees', label: 'Employees', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
        { path: '/hr/leaves', label: 'Leave Approvals', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/hr/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/hr/payroll', label: 'Payroll', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
        { path: '/hr/pf', label: 'Provident Fund', icon: BanknotesIcon, iconSolid: BanknotesIconSolid },
        { path: '/hr/calendar', label: 'Calendar', icon: CalendarIcon, iconSolid: CalendarIconSolid },
      ];
    } else if (user?.role === 'MANAGER') {
      return [
        ...commonItems,
        { path: '/employee/profile', label: 'My Profile', icon: UserCircleIcon, iconSolid: UserCircleIconSolid },
        { path: '/employee/attendance', label: 'My Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/employee/leave', label: 'My Leave', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/employee/payslips', label: 'My Payslips', icon: CreditCardIcon, iconSolid: CreditCardIconSolid },
        { path: '/hr/leaves', label: 'Team Leaves', icon: ShieldCheckIcon, iconSolid: ShieldCheckIconSolid },
        { path: '/hr/attendance', label: 'Team Attendance', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
      ];
    } else {
      // Employee
      return [
        ...commonItems,
        { path: '/employee/profile', label: 'My Profile', icon: UserCircleIcon, iconSolid: UserCircleIconSolid },
        { path: '/employee/attendance', label: 'Attendance', icon: ClockIcon, iconSolid: ClockIconSolid },
        { path: '/employee/leave', label: 'My Leave', icon: CalendarIcon, iconSolid: CalendarIconSolid },
        { path: '/employee/payslips', label: 'My Payslips', icon: CreditCardIcon, iconSolid: CreditCardIconSolid },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 h-screen fixed left-0 top-0 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-purple-600">
        <h1 className="text-3xl font-bold text-white tracking-tight">vikrin</h1>
        <p className="text-purple-300 text-xs mt-1 font-medium">HR & Payroll Platform</p>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 mx-4 mt-4 bg-purple-600/40 rounded-xl border border-purple-500/40">
        <p className="text-white font-semibold text-sm truncate">{user?.name || 'User'}</p>
        <p className="text-purple-300 text-xs mt-0.5">{user?.role || 'Employee'}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const IconSolid = item.iconSolid;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-white text-purple-700 shadow-lg font-bold'
                  : 'text-purple-100 hover:bg-purple-600/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <IconSolid className="w-5 h-5 shrink-0" />
                  ) : (
                    <Icon className="w-5 h-5 shrink-0" />
                  )}
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-purple-200 hover:bg-purple-600/60 hover:text-white transition text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
