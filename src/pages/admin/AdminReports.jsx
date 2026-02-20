import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { DocumentChartBarIcon, ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminReports = () => {
    const [dateRange, setDateRange] = useState('this-month');

    const reports = [
        { title: 'Employee Attendance', description: 'Monthly attendance logs for all employees', icon: CalendarIcon, color: 'text-purple-600 bg-purple-100' },
        { title: 'Payroll Summary', description: 'Salary distribution and tax deductions', icon: DocumentChartBarIcon, color: 'text-green-600 bg-green-100' },
        { title: 'User Activity', description: 'Login history and system usage', icon: DocumentChartBarIcon, color: 'text-blue-600 bg-blue-100' },
    ];

    const handleExport = (reportName) => {
        toast.success(`Exporting ${reportName}...`);
        // Placeholder for export logic
        setTimeout(() => {
            toast.success(`${reportName} exported successfully!`);
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-600 mt-1">Generate and export system reports</p>
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-3-months">Last 3 Months</option>
                        <option value="year-to-date">Year to Date</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report, index) => {
                        const Icon = report.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-lg ${report.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-gray-900">{report.title}</h3>
                                <p className="mt-2 text-gray-600 text-sm">{report.description}</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => handleExport(report.title)}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                                        Export CSV
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminReports;
