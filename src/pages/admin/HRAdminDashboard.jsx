import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import {
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
// Chart.js is available but we'll use a simple div for now to avoid import issues
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HRAdminDashboard = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const stats = [
    { label: 'Total Employees', value: '156', icon: UserGroupIcon, color: 'blue' },
    { label: 'Pending Approvals', value: '12', icon: ClockIcon, color: 'orange' },
    { label: 'Attendance Today', value: '142', icon: ChartBarIcon, color: 'green' },
  ];

  const employees = [
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Developer', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'HR', position: 'Manager', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@company.com', department: 'Sales', position: 'Executive', status: 'active' },
  ];

  const pendingLeaves = [
    { id: 1, employee: 'John Doe', type: 'Sick Leave', from: '2024-03-01', to: '2024-03-03', days: 3, status: 'pending' },
    { id: 2, employee: 'Jane Smith', type: 'Vacation', from: '2024-03-05', to: '2024-03-10', days: 5, status: 'pending' },
  ];

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [145, 150, 148, 152, 149, 0, 0],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const employeeColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Position', accessor: 'position' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const leaveColumns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Type', accessor: 'type' },
    { header: 'From', accessor: 'from' },
    { header: 'To', accessor: 'to' },
    { header: 'Days', accessor: 'days' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const handleApproveLeave = (leave) => {
    console.log('Approve', leave);
  };

  const handleRejectLeave = (leave) => {
    console.log('Reject', leave);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">HR Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Attendance Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Overview (This Week)</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {attendanceData.datasets[0].data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-purple-600 rounded-t-lg transition hover:bg-purple-700"
                  style={{ height: `${(value / 160) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{attendanceData.labels[index]}</span>
                <span className="text-xs font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Leave Approvals</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {leaveColumns.map((col, idx) => (
                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveLeave(leave)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(leave)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowEmployeeModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Add Employee
            </button>
          </div>
          <DataTable
            columns={employeeColumns}
            data={employees}
            onEdit={(emp) => {
              setEditingItem(emp);
              setShowEmployeeModal(true);
            }}
            onDelete={(emp) => console.log('Delete', emp)}
          />
        </div>
      </div>

      {/* Employee Modal */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Employee' : 'Add Employee'}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              defaultValue={editingItem?.name || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={editingItem?.email || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              defaultValue={editingItem?.department || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              defaultValue={editingItem?.position || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowEmployeeModal(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default HRAdminDashboard;

