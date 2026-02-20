import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import StatusBadge from '../../components/Common/StatusBadge';
import { CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HRLeaveApprovals = () => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');

  const [leaves, setLeaves] = useState([
    { id: 1, employee: 'John Doe', employeeId: 'EMP001', type: 'Sick Leave', from: '2024-03-01', to: '2024-03-03', days: 3, status: 'pending', appliedDate: '2024-02-25', reason: 'Fever and cold symptoms' },
    { id: 2, employee: 'Jane Smith', employeeId: 'EMP002', type: 'Vacation', from: '2024-03-05', to: '2024-03-10', days: 5, status: 'pending', appliedDate: '2024-02-28', reason: 'Family vacation' },
    { id: 3, employee: 'Bob Wilson', employeeId: 'EMP003', type: 'Casual Leave', from: '2024-02-20', to: '2024-02-20', days: 1, status: 'approved', appliedDate: '2024-02-15', reason: 'Personal work' },
    { id: 4, employee: 'Alice Johnson', employeeId: 'EMP004', type: 'Earned Leave', from: '2024-02-15', to: '2024-02-18', days: 4, status: 'rejected', appliedDate: '2024-02-10', reason: 'Rest and relaxation', rejectionReason: 'Project deadline approaching' },
    { id: 5, employee: 'Charlie Brown', employeeId: 'EMP005', type: 'Sick Leave', from: '2024-03-08', to: '2024-03-09', days: 2, status: 'pending', appliedDate: '2024-03-01', reason: 'Medical appointment' },
  ]);

  const leaveColumns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Leave Type', accessor: 'type' },
    { header: 'From', accessor: 'from' },
    { header: 'To', accessor: 'to' },
    { header: 'Days', accessor: 'days' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    { header: 'Applied Date', accessor: 'appliedDate' },
  ];

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setShowApprovalModal(true);
  };

  const handleApprove = () => {
    setLeaves(leaves.map(l => 
      l.id === selectedLeave.id ? { ...l, status: 'approved' } : l
    ));
    toast.success(`Leave approved for ${selectedLeave.employee}`);
    setShowApprovalModal(false);
    setSelectedLeave(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setLeaves(leaves.map(l => 
      l.id === selectedLeave.id ? { ...l, status: 'rejected', rejectionReason } : l
    ));
    toast.success(`Leave rejected for ${selectedLeave.employee}`);
    setShowApprovalModal(false);
    setSelectedLeave(null);
    setRejectionReason('');
  };

  const handleBulkApprove = (leaveIds) => {
    setLeaves(leaves.map(l => 
      leaveIds.includes(l.id) ? { ...l, status: 'approved' } : l
    ));
    toast.success(`${leaveIds.length} leave(s) approved`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Approvals</h1>
          <p className="text-gray-600 mt-1">Review and manage employee leave requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900">{leaves.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingLeaves.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedLeaves.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejectedLeaves.length}</p>
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
                placeholder="Search by employee name, ID, or leave type..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pending Leaves Alert */}
        {pendingLeaves.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-yellow-800">You have {pendingLeaves.length} pending leave request(s)</p>
                <p className="text-sm text-yellow-700 mt-1">Please review and take action</p>
              </div>
              <button
                onClick={() => handleBulkApprove(pendingLeaves.map(l => l.id))}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Approve All
              </button>
            </div>
          </div>
        )}

        {/* Leave Requests Table */}
        <DataTable
          columns={leaveColumns}
          data={filteredLeaves}
          onView={handleViewDetails}
        />
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedLeave(null);
          setRejectionReason('');
        }}
        title="Leave Request Details"
        size="lg"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <p className="font-medium text-gray-900">{selectedLeave.employee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium text-gray-900">{selectedLeave.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leave Type</p>
                <p className="font-medium text-gray-900">{selectedLeave.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days</p>
                <p className="font-medium text-gray-900">{selectedLeave.days} day(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">From Date</p>
                <p className="font-medium text-gray-900">{selectedLeave.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To Date</p>
                <p className="font-medium text-gray-900">{selectedLeave.to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Applied Date</p>
                <p className="font-medium text-gray-900">{selectedLeave.appliedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={selectedLeave.status} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Reason</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLeave.reason}</p>
            </div>
            {selectedLeave.rejectionReason && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Rejection Reason</p>
                <p className="text-red-900 bg-red-50 p-3 rounded-lg">{selectedLeave.rejectionReason}</p>
              </div>
            )}
            {selectedLeave.status === 'pending' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter reason for rejection..."
                  />
                </div>
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                  >
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Approve
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default HRLeaveApprovals;



