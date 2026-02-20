import React, { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import StatusBadge from '../components/Common/StatusBadge';
import { CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeaveManagement = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const leaveHistory = [
    { id: 1, type: 'Sick Leave', from: '2024-02-15', to: '2024-02-16', days: 2, status: 'approved', appliedDate: '2024-02-10' },
    { id: 2, type: 'Vacation', from: '2024-02-20', to: '2024-02-22', days: 3, status: 'pending', appliedDate: '2024-02-18' },
    { id: 3, type: 'Casual Leave', from: '2024-01-10', to: '2024-01-10', days: 1, status: 'approved', appliedDate: '2024-01-05' },
  ];

  const leaveTypes = ['Sick Leave', 'Vacation', 'Casual Leave', 'Earned Leave', 'Personal Leave'];

  const columns = [
    { header: 'Type', accessor: 'type' },
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

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.fromDate || !formData.toDate || !formData.reason) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success('Leave application submitted successfully!');
    setShowApplyModal(false);
    setFormData({ type: '', fromDate: '', toDate: '', reason: '' });
  };

  const handleApprove = () => {
    toast.success('Leave approved successfully!');
    setShowApprovalModal(false);
    setSelectedLeave(null);
  };

  const handleReject = () => {
    toast.success('Leave rejected');
    setShowApprovalModal(false);
    setSelectedLeave(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Apply for leave and track your leave history</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Apply for Leave
          </button>
        </div>

        {/* Leave Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Accumulated', days: 6.0, color: 'blue' },
            { label: 'Earned Leave', days: 1.25, color: 'green' },
            { label: 'Casual Leave', days: 0.5, color: 'purple' },
            { label: 'Sick Leave', days: 3.0, color: 'orange' },
          ].map((balance, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 mb-2">{balance.label}</p>
              <p className="text-3xl font-bold text-gray-900">{balance.days}</p>
              <p className="text-xs text-gray-500 mt-1">days remaining</p>
            </div>
          ))}
        </div>

        {/* Leave History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave History</h2>
          <DataTable
            columns={columns}
            data={leaveHistory}
            onView={(leave) => {
              setSelectedLeave(leave);
              setShowApprovalModal(true);
            }}
          />
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => {
          setShowApplyModal(false);
          setFormData({ type: '', fromDate: '', toDate: '', reason: '' });
        }}
        title="Apply for Leave"
        size="md"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter reason for leave..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowApplyModal(false);
                setFormData({ type: '', fromDate: '', toDate: '', reason: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedLeave(null);
        }}
        title="Leave Details"
        size="md"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{selectedLeave.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days</p>
                <p className="font-medium text-gray-900">{selectedLeave.days}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium text-gray-900">{selectedLeave.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium text-gray-900">{selectedLeave.to}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={selectedLeave.status} />
              </div>
            </div>
            {selectedLeave.status === 'pending' && (
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default LeaveManagement;



