import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchCompanyQuery, setSearchCompanyQuery] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [filterCompanyStatus, setFilterCompanyStatus] = useState('all');
  const [filterUserRole, setFilterUserRole] = useState('all');
  const [filterUserStatus, setFilterUserStatus] = useState('all');
  // All companies data (for reference, but we'll filter to show only user's company)
  const allCompanies = [
    { id: 1, name: 'Tech Corp', email: 'contact@techcorp.com', phone: '+1 234-567-8900', address: '123 Tech Street, San Francisco', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'StartupXYZ', email: 'hello@startupxyz.com', phone: '+1 234-567-8901', address: '456 Startup Ave, New York', status: 'active', createdAt: '2024-02-20' },
    { id: 3, name: 'Growth Inc', email: 'info@growthinc.com', phone: '+1 234-567-8902', address: '789 Growth Blvd, Austin', status: 'active', createdAt: '2024-01-10' },
  ];
  
  // All users data (for reference, but we'll filter to show only user's company)
  const allUsers = [
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'HR', company: 'Tech Corp', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@startup.com', role: 'ADMIN', company: 'StartupXYZ', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@growth.com', role: 'EMPLOYEE', company: 'Growth Inc', status: 'inactive' },
  ];

  // Filter to show only the logged-in user's company
  const userCompany = user?.company || 'Tech Corp';
  const [companies] = useState(() => allCompanies.filter(c => c.name === userCompany));
  const [users, setUsers] = useState(() => allUsers.filter(u => u.company === userCompany));

  // Calculate stats dynamically - only for user's company
  const stats = [
    { label: 'My Company', value: userCompany, icon: BuildingOfficeIcon, color: 'purple' },
    { label: 'Total Users', value: users.length.toString(), icon: UserGroupIcon, color: 'blue' },
    { label: 'HR Admins', value: users.filter(u => u.role === 'HR').length.toString(), icon: ShieldCheckIcon, color: 'green' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length.toString(), icon: UserIcon, color: 'orange' },
  ];

  // Calculate users count for each company dynamically
  const companiesWithUserCount = companies.map(company => ({
    ...company,
    users: users.filter(u => u.company === company.name).length
  }));

  // Filter companies
  const filteredCompanies = companiesWithUserCount.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchCompanyQuery.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchCompanyQuery.toLowerCase());
    const matchesStatus = filterCompanyStatus === 'all' || company.status === filterCompanyStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchUserQuery.toLowerCase());
    const matchesRole = filterUserRole === 'all' || user.role === filterUserRole;
    const matchesStatus = filterUserStatus === 'all' || user.status === filterUserStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const companyColumns = [
    { header: 'Company Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Users', 
      accessor: 'users',
      render: (value, row) => {
        const userCount = users.filter(u => u.company === row.name).length;
        return <span className="font-semibold">{userCount}</span>;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    { header: 'Created', accessor: 'createdAt' },
  ];

  const userColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Company', accessor: 'company' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];


  const handleEditUser = (user) => {
    setEditingItem(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
      toast.success('User deleted successfully!');
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: editingItem ? editingItem.id : users.length + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      company: userCompany, // Always use the logged-in user's company
      status: formData.get('status'),
    };

    if (editingItem) {
      setUsers(users.map(u => u.id === editingItem.id ? newUser : u));
      toast.success('User updated successfully!');
    } else {
      setUsers([...users, newUser]);
      toast.success('User added successfully!');
    }
    setShowUserModal(false);
    setEditingItem(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>

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

        {/* Companies Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Company</h2>
              <p className="text-gray-600 text-sm mt-1">View your company information</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchCompanyQuery}
                  onChange={(e) => setSearchCompanyQuery(e.target.value)}
                  placeholder="Search companies by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterCompanyStatus}
                  onChange={(e) => setFilterCompanyStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <DataTable
            columns={companyColumns}
            data={filteredCompanies}
          />
        </div>

        {/* Users Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Users</h2>
              <p className="text-gray-600 text-sm mt-1">Manage users in your company</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const csvContent = users.map(u => `${u.name},${u.email},${u.role},${u.company},${u.status}`).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'users_export.csv';
                  a.click();
                  toast.success('Users exported successfully!');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition flex items-center shadow-lg"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowUserModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New User
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Search users by name, email, or company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterUserRole}
                  onChange={(e) => setFilterUserRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="HR">HR</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterUserStatus}
                  onChange={(e) => setFilterUserStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <DataTable
            columns={userColumns}
            data={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Users by Role</h3>
            <div className="space-y-3">
              {[
                { role: 'Admin', count: users.filter(u => u.role === 'ADMIN').length, colorClass: 'bg-purple-500' },
                { role: 'HR', count: users.filter(u => u.role === 'HR').length, colorClass: 'bg-blue-500' },
                { role: 'Employee', count: users.filter(u => u.role === 'EMPLOYEE').length, colorClass: 'bg-green-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.colorClass} mr-3`}></div>
                    <span className="text-gray-700 font-medium">{item.role}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Company created', user: 'Admin', time: '2 hours ago', type: 'company' },
                { action: 'User updated', user: 'Admin', time: '5 hours ago', type: 'user' },
                { action: 'User added', user: 'Admin', time: '1 day ago', type: 'user' },
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
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              name="name"
              defaultValue={editingItem?.name || ''}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              defaultValue={editingItem?.email || ''}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                name="role"
                defaultValue={editingItem?.role || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Role</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={userCompany}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">All users belong to your company</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              name="status"
              defaultValue={editingItem?.status || 'active'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowUserModal(false);
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
              {editingItem ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;



