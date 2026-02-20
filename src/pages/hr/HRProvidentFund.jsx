import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { CurrencyDollarIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HRProvidentFund = () => {
  const [showPFModal, setShowPFModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [pfRecords, setPfRecords] = useState([
    { id: 1, employeeId: 'EMP001', employeeName: 'John Doe', uan: '123456789012', employeeContribution: 5000, employerContribution: 5000, totalBalance: 120000, status: 'active', lastUpdated: '2024-02-28' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Jane Smith', uan: '123456789013', employeeContribution: 6000, employerContribution: 6000, totalBalance: 150000, status: 'active', lastUpdated: '2024-02-28' },
    { id: 3, employeeId: 'EMP003', employeeName: 'Bob Wilson', uan: '123456789014', employeeContribution: 4500, employerContribution: 4500, totalBalance: 95000, status: 'active', lastUpdated: '2024-02-28' },
    { id: 4, employeeId: 'EMP004', employeeName: 'Alice Johnson', uan: '123456789015', employeeContribution: 5500, employerContribution: 5500, totalBalance: 110000, status: 'inactive', lastUpdated: '2024-01-15' },
    { id: 5, employeeId: 'EMP005', employeeName: 'Charlie Brown', uan: '123456789016', employeeContribution: 4000, employerContribution: 4000, totalBalance: 80000, status: 'active', lastUpdated: '2024-02-28' },
  ]);

  const pfColumns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Employee Name', accessor: 'employeeName' },
    { header: 'UAN', accessor: 'uan' },
    {
      header: 'Employee Contribution',
      accessor: 'employeeContribution',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      header: 'Employer Contribution',
      accessor: 'employerContribution',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      header: 'Total Balance',
      accessor: 'totalBalance',
      render: (value) => <span className="font-semibold text-green-600">₹{value.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    { header: 'Last Updated', accessor: 'lastUpdated' },
  ];

  const filteredRecords = pfRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.uan.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEmployeeContribution = pfRecords.reduce((sum, r) => sum + r.employeeContribution, 0);
  const totalEmployerContribution = pfRecords.reduce((sum, r) => sum + r.employerContribution, 0);
  const totalBalance = pfRecords.reduce((sum, r) => sum + r.totalBalance, 0);

  const handleSavePF = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRecord = {
      id: editingItem ? editingItem.id : pfRecords.length + 1,
      employeeId: formData.get('employeeId'),
      employeeName: formData.get('employeeName'),
      uan: formData.get('uan'),
      employeeContribution: parseFloat(formData.get('employeeContribution')),
      employerContribution: parseFloat(formData.get('employerContribution')),
      totalBalance: parseFloat(formData.get('totalBalance')),
      status: formData.get('status'),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    if (editingItem) {
      setPfRecords(pfRecords.map(r => r.id === editingItem.id ? newRecord : r));
      toast.success('PF record updated successfully!');
    } else {
      setPfRecords([...pfRecords, newRecord]);
      toast.success('PF record added successfully!');
    }
    setShowPFModal(false);
    setEditingItem(null);
  };

  const handleDelete = (record) => {
    if (window.confirm(`Are you sure you want to delete PF record for ${record.employeeName}?`)) {
      setPfRecords(pfRecords.filter(r => r.id !== record.id));
      toast.success('PF record deleted successfully!');
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file processing
      toast.success('PF file uploaded successfully! Processing...');
      setTimeout(() => {
        toast.success('PF records updated from file!');
        setShowUploadModal(false);
      }, 2000);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'UAN', 'Employee Contribution', 'Employer Contribution', 'Total Balance', 'Status', 'Last Updated'],
      ...pfRecords.map(r => [
        r.employeeId,
        r.employeeName,
        r.uan,
        r.employeeContribution,
        r.employerContribution,
        r.totalBalance,
        r.status,
        r.lastUpdated,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pf_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('PF records exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provident Fund (PF) Management</h1>
            <p className="text-gray-600 mt-1">Manage employee Provident Fund contributions and balances</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              Upload PF File
            </button>
            <button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowPFModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add PF Record
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Employee Contribution</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalEmployeeContribution.toLocaleString('en-IN')}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Employer Contribution</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalEmployerContribution.toLocaleString('en-IN')}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total PF Balance</p>
                <p className="text-2xl font-bold text-green-600">₹{totalBalance.toLocaleString('en-IN')}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
                <p className="text-2xl font-bold text-purple-600">
                  {pfRecords.filter(r => r.status === 'active').length}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
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
                placeholder="Search by employee name, ID, or UAN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* PF Records Table */}
        <DataTable
          columns={pfColumns}
          data={filteredRecords}
          onEdit={(record) => {
            setEditingItem(record);
            setShowPFModal(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit PF Modal */}
      <Modal
        isOpen={showPFModal}
        onClose={() => {
          setShowPFModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit PF Record' : 'Add New PF Record'}
        size="lg"
      >
        <form onSubmit={handleSavePF} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                defaultValue={editingItem?.employeeId || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="EMP001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                defaultValue={editingItem?.employeeName || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter employee name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UAN (Universal Account Number) *</label>
            <input
              type="text"
              name="uan"
              defaultValue={editingItem?.uan || ''}
              required
              pattern="[0-9]{12}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="12-digit UAN"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Contribution (₹) *</label>
              <input
                type="number"
                name="employeeContribution"
                defaultValue={editingItem?.employeeContribution || ''}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer Contribution (₹) *</label>
              <input
                type="number"
                name="employerContribution"
                defaultValue={editingItem?.employerContribution || ''}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Balance (₹) *</label>
            <input
              type="number"
              name="totalBalance"
              defaultValue={editingItem?.totalBalance || ''}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
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
                setShowPFModal(false);
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
              {editingItem ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload PF File Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload PF File"
        size="md"
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select PF File (CSV/Excel)</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>File Format:</strong> Employee ID, Employee Name, UAN, Employee Contribution, Employer Contribution, Total Balance, Status
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default HRProvidentFund;

