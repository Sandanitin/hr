import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { CurrencyDollarIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, DocumentArrowUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HRPayroll = () => {
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [payrollRecords, setPayrollRecords] = useState([
    { id: 1, employeeId: 'EMP001', employeeName: 'John Doe', month: '2024-02', basicSalary: 50000, allowances: 10000, deductions: 5000, netSalary: 55000, status: 'paid', paidDate: '2024-02-28', paymentMethod: 'Bank Transfer' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Jane Smith', month: '2024-02', basicSalary: 60000, allowances: 12000, deductions: 6000, netSalary: 66000, status: 'paid', paidDate: '2024-02-28', paymentMethod: 'Bank Transfer' },
    { id: 3, employeeId: 'EMP003', employeeName: 'Bob Wilson', month: '2024-02', basicSalary: 45000, allowances: 9000, deductions: 4500, netSalary: 49500, status: 'paid', paidDate: '2024-02-28', paymentMethod: 'Bank Transfer' },
    { id: 4, employeeId: 'EMP004', employeeName: 'Alice Johnson', month: '2024-02', basicSalary: 55000, allowances: 11000, deductions: 5500, netSalary: 60500, status: 'pending', paidDate: '-', paymentMethod: '-' },
    { id: 5, employeeId: 'EMP005', employeeName: 'Charlie Brown', month: '2024-02', basicSalary: 40000, allowances: 8000, deductions: 4000, netSalary: 44000, status: 'paid', paidDate: '2024-02-28', paymentMethod: 'Bank Transfer' },
    { id: 6, employeeId: 'EMP001', employeeName: 'John Doe', month: '2024-01', basicSalary: 50000, allowances: 10000, deductions: 5000, netSalary: 55000, status: 'paid', paidDate: '2024-01-28', paymentMethod: 'Bank Transfer' },
  ]);

  const payrollColumns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Employee Name', accessor: 'employeeName' },
    { header: 'Month', accessor: 'month' },
    {
      header: 'Basic Salary',
      accessor: 'basicSalary',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      header: 'Deductions',
      accessor: 'deductions',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      header: 'Net Salary',
      accessor: 'netSalary',
      render: (value) => <span className="font-semibold text-green-600">₹{value.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    { header: 'Paid Date', accessor: 'paidDate' },
    { header: 'Payment Method', accessor: 'paymentMethod' },
  ];

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = filterMonth === 'all' || record.month === filterMonth;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const totalNetSalary = payrollRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.netSalary, 0);
  const pendingAmount = payrollRecords
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.netSalary, 0);
  const paidCount = payrollRecords.filter(r => r.status === 'paid').length;
  const pendingCount = payrollRecords.filter(r => r.status === 'pending').length;

  // Get unique months for filter
  const months = [...new Set(payrollRecords.map(r => r.month))].sort().reverse();

  const handleSavePayroll = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRecord = {
      id: editingItem ? editingItem.id : payrollRecords.length + 1,
      employeeId: formData.get('employeeId'),
      employeeName: formData.get('employeeName'),
      month: formData.get('month'),
      basicSalary: parseFloat(formData.get('basicSalary')),
      allowances: parseFloat(formData.get('allowances')),
      deductions: parseFloat(formData.get('deductions')),
      netSalary: parseFloat(formData.get('basicSalary')) + parseFloat(formData.get('allowances')) - parseFloat(formData.get('deductions')),
      status: formData.get('status'),
      paidDate: formData.get('status') === 'paid' ? (formData.get('paidDate') || new Date().toISOString().split('T')[0]) : '-',
      paymentMethod: formData.get('status') === 'paid' ? formData.get('paymentMethod') : '-',
    };

    if (editingItem) {
      setPayrollRecords(payrollRecords.map(r => r.id === editingItem.id ? newRecord : r));
      toast.success('Payroll record updated successfully!');
    } else {
      setPayrollRecords([...payrollRecords, newRecord]);
      toast.success('Payroll record added successfully!');
    }
    setShowPayrollModal(false);
    setEditingItem(null);
  };

  const handleDelete = (record) => {
    if (window.confirm(`Are you sure you want to delete payroll record for ${record.employeeName}?`)) {
      setPayrollRecords(payrollRecords.filter(r => r.id !== record.id));
      toast.success('Payroll record deleted successfully!');
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file processing
      toast.success('Payroll file uploaded successfully! Processing...');
      setTimeout(() => {
        toast.success('Payroll records updated from file!');
        setShowUploadModal(false);
      }, 2000);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'Month', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Paid Date', 'Payment Method'],
      ...payrollRecords.map(r => [
        r.employeeId,
        r.employeeName,
        r.month,
        r.basicSalary,
        r.allowances,
        r.deductions,
        r.netSalary,
        r.status,
        r.paidDate,
        r.paymentMethod,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Payroll records exported successfully!');
  };

  const handleBulkProcess = () => {
    const pendingRecords = payrollRecords.filter(r => r.status === 'pending');
    if (pendingRecords.length === 0) {
      toast.error('No pending payroll records to process');
      return;
    }
    if (window.confirm(`Process ${pendingRecords.length} pending payroll record(s)?`)) {
      setPayrollRecords(payrollRecords.map(r => 
        r.status === 'pending' 
          ? { ...r, status: 'paid', paidDate: new Date().toISOString().split('T')[0], paymentMethod: 'Bank Transfer' }
          : r
      ));
      toast.success(`${pendingRecords.length} payroll record(s) processed successfully!`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600 mt-1">Manage employee payroll, upload files, and process payments</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              Upload Payroll
            </button>
            <button
              onClick={handleBulkProcess}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Process Pending
            </button>
            <button
              onClick={handleExport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowPayrollModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Record
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{totalNetSalary.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">{paidCount} employees</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">{pendingCount} employees</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{payrollRecords.length}</p>
                <p className="text-xs text-gray-500 mt-1">{months.length} months</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {payrollRecords.filter(r => {
                    const currentMonth = new Date().toISOString().slice(0, 7);
                    return r.month === currentMonth;
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">records</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employee name or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payroll Records Table */}
        <DataTable
          columns={payrollColumns}
          data={filteredRecords}
          onEdit={(record) => {
            setEditingItem(record);
            setShowPayrollModal(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Payroll Modal */}
      <Modal
        isOpen={showPayrollModal}
        onClose={() => {
          setShowPayrollModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Payroll Record' : 'Add New Payroll Record'}
        size="lg"
      >
        <form onSubmit={handleSavePayroll} className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
              <input
                type="month"
                name="month"
                defaultValue={editingItem?.month || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                defaultValue={editingItem?.status || 'pending'}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₹) *</label>
              <input
                type="number"
                name="basicSalary"
                defaultValue={editingItem?.basicSalary || ''}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allowances (₹) *</label>
              <input
                type="number"
                name="allowances"
                defaultValue={editingItem?.allowances || ''}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deductions (₹) *</label>
              <input
                type="number"
                name="deductions"
                defaultValue={editingItem?.deductions || ''}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          {editingItem?.status === 'paid' || (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paid Date</label>
                <input
                  type="date"
                  name="paidDate"
                  defaultValue={editingItem?.paidDate && editingItem.paidDate !== '-' ? editingItem.paidDate : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  defaultValue={editingItem?.paymentMethod && editingItem.paymentMethod !== '-' ? editingItem.paymentMethod : 'Bank Transfer'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Net Salary:</strong>{' '}
              <span className="text-green-600 font-semibold">
                ₹{((editingItem?.basicSalary || 0) + (editingItem?.allowances || 0) - (editingItem?.deductions || 0)).toLocaleString('en-IN')}
              </span>
              {' '}(Calculated automatically)
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowPayrollModal(false);
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

      {/* Upload Payroll File Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Payroll File"
        size="md"
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payroll File (CSV/Excel)</label>
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
            <p className="text-sm text-blue-800 mb-2">
              <strong>File Format:</strong>
            </p>
            <p className="text-xs text-blue-700">
              Employee ID, Employee Name, Month (YYYY-MM), Basic Salary, Allowances, Deductions, Status, Paid Date, Payment Method
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

export default HRPayroll;

