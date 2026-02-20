import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

const AdminHome = () => {
    const { user } = useAuth();

    // Mock data for stats - in a real app this would come from an API
    // We're keeping the logic consistent with what was in SuperAdminDashboard
    const userCompany = user?.company || 'Tech Corp';

    // Placeholder stats
    const stats = [
        { label: 'My Company', value: userCompany, icon: BuildingOfficeIcon, color: 'purple' },
        { label: 'Total Users', value: '12', icon: UserGroupIcon, color: 'blue' },
        { label: 'HR Admins', value: '3', icon: ShieldCheckIcon, color: 'green' },
        { label: 'Active Users', value: '10', icon: UserIcon, color: 'orange' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
                            blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
                            green: { bg: 'bg-green-100', text: 'text-green-600' },
                            orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
                        };
                        const colors = colorClasses[stat.color] || colorClasses.purple;
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[
                            { action: 'User updated', user: 'Admin', time: '5 hours ago', type: 'user' },
                            { action: 'New employee onboarded', user: 'HR Manager', time: '1 day ago', type: 'user' },
                            { action: 'Payroll processed', user: 'Finance', time: '2 days ago', type: 'finance' },
                        ].map((log, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{log.action}</p>
                                    <p className="text-sm text-gray-500">by {log.user}</p>
                                </div>
                                <p className="text-sm text-gray-500">{log.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminHome;
