import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminHome from './admin/AdminHome';
import HRAdminDashboard from './admin/HRAdminDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard';
import DashboardLayout from '../components/Layout/DashboardLayout';
import WelcomeBanner from '../components/Dashboard/WelcomeBanner';
import HolidaysCard from '../components/Dashboard/HolidaysCard';
import PraiseCard from '../components/Dashboard/PraiseCard';
import OnLeaveCard from '../components/Dashboard/OnLeaveCard';
import InboxCard from '../components/Dashboard/InboxCard';
import WorkingRemotelyCard from '../components/Dashboard/WorkingRemotelyCard';
import TimeTrackingCard from '../components/Dashboard/TimeTrackingCard';
import LeaveBalancesCard from '../components/Dashboard/LeaveBalancesCard';
import BirthdaysCard from '../components/Dashboard/BirthdaysCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';

const Dashboard = () => {
  const { user } = useAuth();

  // Show role-specific dashboard
  if (user?.role === 'ADMIN') {
    return <AdminHome />;
  } else if (user?.role === 'HR') {
    return <HRAdminDashboard />;
  } else {
    // Employee dashboard with widgets
    return (
      <DashboardLayout>
        <WelcomeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Access Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HolidaysCard />
              <PraiseCard />
            </div>

            {/* Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OnLeaveCard />
              <InboxCard />
              <WorkingRemotelyCard />
            </div>

            {/* Time Tracking */}
            <TimeTrackingCard />

            {/* Leave Balances */}
            <LeaveBalancesCard />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BirthdaysCard />
            <ActivityFeed />
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default Dashboard;

