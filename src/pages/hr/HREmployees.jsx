import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HREmployees = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', phone: '+1 234-567-8900', department: 'Engineering', position: 'Senior Developer', status: 'active', joinDate: '2023-01-15', employeeId: 'EMP001' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', phone: '+1 234-567-8901', department: 'HR', position: 'HR Manager', status: 'active', joinDate: '2022-06-20', employeeId: 'EMP002' },
    { id: 3, name: 'Bob Wilson', email: 'bob@company.com', phone: '+1 234-567-8902', department: 'Sales', position: 'Sales Executive', status: 'active', joinDate: '2023-03-10', employeeId: 'EMP003' },
    { id: 4, name: 'Alice Johnson', email: 'alice@company.com', phone: '+1 234-567-8903', department: 'Marketing', position: 'Marketing Specialist', status: 'inactive', joinDate: '2022-11-05', employeeId: 'EMP004' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@company.com', phone: '+1 234-567-8904', department: 'Engineering', position: 'Junior Developer', status: 'active', joinDate: '2024-01-08', employeeId: 'EMP005' },
  ]);

  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

  const employeeColumns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Position', accessor: 'position' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    { header: 'Join Date', accessor: 'joinDate' },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmployee = {
      id: editingItem ? editingItem.id : employees.length + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      position: formData.get('position'),
      status: formData.get('status'),
      joinDate: formData.get('joinDate'),
      employeeId: editingItem ? editingItem.employeeId : `EMP${String(employees.length + 1).padStart(3, '0')}`,
    };

    if (editingItem) {
      setEmployees(employees.map(emp => emp.id === editingItem.id ? newEmployee : emp));
      toast.success('Employee updated successfully!');
    } else {
      setEmployees([...employees, newEmployee]);
      toast.success('Employee added successfully!');
    }
    setShowEmployeeModal(false);
    setEditingItem(null);
  };

  const handleDelete = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      setEmployees(employees.filter(emp => emp.id !== employee.id));
      toast.success('Employee deleted successfully!');
    }
  };

  const handleView = (employee) => {
    setEditingItem(employee);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage all employees in your organization</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowEmployeeModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Employee
          </button>
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
                placeholder="Search by name, email, or employee ID..."
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active Employees</p>
            <p className="text-3xl font-bold text-green-600">{employees.filter(e => e.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Inactive Employees</p>
            <p className="text-3xl font-bold text-gray-600">{employees.filter(e => e.status === 'inactive').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Departments</p>
            <p className="text-3xl font-bold text-purple-600">{new Set(employees.map(e => e.department)).size}</p>
          </div>
        </div>

        {/* Employee Table */}
        <DataTable
          columns={employeeColumns}
          data={filteredEmployees}
          onEdit={(emp) => {
            setEditingItem(emp);
            setShowEmployeeModal(true);
          }}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                defaultValue={editingItem?.name || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={editingItem?.phone || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join Date *</label>
              <input
                type="date"
                name="joinDate"
                defaultValue={editingItem?.joinDate || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                defaultValue={editingItem?.department || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
              <input
                type="text"
                name="position"
                defaultValue={editingItem?.position || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <div className="flex justify-end space-x-3 pt-4">
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
              {editingItem ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Employee Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setEditingItem(null);
        }}
        title="Employee Details"
        size="md"
      >
        {editingItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium text-gray-900">{editingItem.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={editingItem.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{editingItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{editingItem.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{editingItem.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{editingItem.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium text-gray-900">{editingItem.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium text-gray-900">{editingItem.joinDate}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default HREmployees;



