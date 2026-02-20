import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const { user } = useAuth();
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [filterUserRole, setFilterUserRole] = useState('all');
    const [filterUserStatus, setFilterUserStatus] = useState('all');

    // Logic to show user's company
    const userCompany = user?.company || 'Tech Corp';

    // Mock Users data
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'HR', company: userCompany, status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', role: 'ADMIN', company: userCompany, status: 'active' },
        { id: 3, name: 'Bob Wilson', email: 'bob@techcorp.com', role: 'EMPLOYEE', company: userCompany, status: 'inactive' },
    ]);


    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchUserQuery.toLowerCase());
        const matchesRole = filterUserRole === 'all' || user.role === filterUserRole;
        const matchesStatus = filterUserStatus === 'all' || user.status === filterUserStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

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
            company: userCompany,
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
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
                                placeholder="Search users..."
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
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
