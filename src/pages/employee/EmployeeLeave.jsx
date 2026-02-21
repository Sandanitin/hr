import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
    CalendarDaysIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const leaveTypes = [
    { code: 'CL', label: 'Casual Leave', total: 12, used: 3, color: 'blue' },
    { code: 'SL', label: 'Sick Leave', total: 10, used: 1, color: 'pink' },
    { code: 'PL', label: 'Planned / Earned Leave', total: 15, used: 5, color: 'purple' },
    { code: 'LOP', label: 'Loss of Pay', total: '∞', used: 0, color: 'red' },
];

const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', bar: 'bg-pink-500', badge: 'bg-pink-100 text-pink-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-400', badge: 'bg-red-100 text-red-700' },
};

const initialHistory = [
    { id: 1, type: 'Sick Leave', from: '2026-01-15', to: '2026-01-16', days: 2, reason: 'Fever & cold', status: 'approved', appliedOn: '2026-01-14' },
    { id: 2, type: 'Casual Leave', from: '2026-02-05', to: '2026-02-05', days: 1, reason: 'Personal work', status: 'approved', appliedOn: '2026-02-03' },
    { id: 3, type: 'Planned Leave', from: '2026-03-20', to: '2026-03-22', days: 3, reason: 'Family function', status: 'pending', appliedOn: '2026-02-20' },
    { id: 4, type: 'Casual Leave', from: '2026-01-28', to: '2026-01-28', days: 1, reason: 'Personal emergency', status: 'rejected', appliedOn: '2026-01-27' },
];

const holidays = [
    { date: '14 Mar', name: 'Holi', day: 'Friday' },
    { date: '18 Apr', name: 'Good Friday', day: 'Friday' },
    { date: '14 Apr', name: 'Ambedkar Jayanti', day: 'Monday' },
    { date: '01 May', name: 'Labour Day', day: 'Thursday' },
];

const StatusBadge = ({ status }) => {
    const styles = {
        approved: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        rejected: 'bg-red-100 text-red-700',
    };
    const icons = {
        approved: <CheckCircleIcon className="w-3.5 h-3.5" />,
        pending: <ClockIcon className="w-3.5 h-3.5" />,
        rejected: <XCircleIcon className="w-3.5 h-3.5" />,
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
            {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const EmployeeLeave = () => {
    const [showForm, setShowForm] = useState(false);
    const [history, setHistory] = useState(initialHistory);
    const [form, setForm] = useState({ type: 'CL', from: '', to: '', halfDay: false, reason: '' });
    const [filter, setFilter] = useState('all');

    const handleApply = (e) => {
        e.preventDefault();
        if (!form.from || !form.to || !form.reason) {
            toast.error('Please fill all required fields');
            return;
        }
        const from = new Date(form.from);
        const to = new Date(form.to);
        if (to < from) { toast.error('End date cannot be before start date'); return; }
        const days = form.halfDay ? 0.5 : Math.round((to - from) / (1000 * 60 * 60 * 24)) + 1;
        const typeMap = { CL: 'Casual Leave', SL: 'Sick Leave', PL: 'Planned Leave', LOP: 'Loss of Pay' };
        const newLeave = {
            id: history.length + 1,
            type: typeMap[form.type],
            from: form.from,
            to: form.to,
            days,
            reason: form.reason,
            status: 'pending',
            appliedOn: new Date().toISOString().split('T')[0],
        };
        setHistory([newLeave, ...history]);
        setForm({ type: 'CL', from: '', to: '', halfDay: false, reason: '' });
        setShowForm(false);
        toast.success('Leave application submitted successfully!');
    };

    const filteredHistory = filter === 'all' ? history : history.filter((h) => h.status === filter);

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
                        <p className="text-gray-500 mt-1">Apply for leave, track balances, and view history</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition shadow-md hover:shadow-purple-400/30"
                    >
                        <PlusIcon className="w-5 h-5" /> Apply for Leave
                    </button>
                </div>

                {/* Leave Balance Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {leaveTypes.map((lt) => {
                        const c = colorMap[lt.color];
                        const pct = lt.total === '∞' ? 0 : Math.round((lt.used / lt.total) * 100);
                        const remaining = lt.total === '∞' ? '∞' : lt.total - lt.used;
                        return (
                            <div key={lt.code} className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{lt.code}</span>
                                    <CalendarDaysIcon className={`w-5 h-5 ${c.text}`} />
                                </div>
                                <p className={`text-3xl font-bold ${c.text}`}>{remaining}</p>
                                <p className="text-xs text-gray-500 mt-1">{lt.label}</p>
                                <p className="text-xs text-gray-400">{lt.used} used of {lt.total}</p>
                                {lt.total !== '∞' && (
                                    <div className="mt-3 h-1.5 bg-white rounded-full overflow-hidden">
                                        <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Apply Leave Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PlusIcon className="w-5 h-5 text-purple-600" /> Apply for Leave
                        </h2>
                        <form onSubmit={handleApply} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Leave Type *</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="CL">Casual Leave</option>
                                        <option value="SL">Sick Leave</option>
                                        <option value="PL">Planned / Earned Leave</option>
                                        <option value="LOP">Loss of Pay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From Date *</label>
                                    <input
                                        type="date"
                                        value={form.from}
                                        onChange={(e) => setForm({ ...form, from: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To Date *</label>
                                    <input
                                        type="date"
                                        value={form.to}
                                        onChange={(e) => setForm({ ...form, to: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="halfDay"
                                    checked={form.halfDay}
                                    onChange={(e) => setForm({ ...form, halfDay: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 rounded"
                                />
                                <label htmlFor="halfDay" className="text-sm text-gray-700 font-medium">Half Day</label>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reason *</label>
                                <textarea
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    rows={3}
                                    placeholder="Briefly describe the reason for leave..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Leave History */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Leave History</h2>
                            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${filter === f ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {filteredHistory.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <CalendarDaysIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                                    <p>No leave records found</p>
                                </div>
                            ) : filteredHistory.map((leave) => (
                                <div key={leave.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{leave.type}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {leave.from} → {leave.to} · {leave.days} day{leave.days !== 1 ? 's' : ''}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 italic">"{leave.reason}"</p>
                                        </div>
                                        <div className="text-right">
                                            <StatusBadge status={leave.status} />
                                            <p className="text-xs text-gray-400 mt-1">Applied: {leave.appliedOn}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Holidays */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <InformationCircleIcon className="w-5 h-5 text-orange-500" /> Upcoming Holidays
                        </h2>
                        <div className="space-y-3">
                            {holidays.map((h, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex flex-col items-center justify-center text-xs font-bold leading-tight shrink-0">
                                        <span className="text-base">{h.date.split(' ')[0]}</span>
                                        <span>{h.date.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{h.name}</p>
                                        <p className="text-xs text-gray-500">{h.day}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                <InformationCircleIcon className="w-3.5 h-3.5" />
                                Leave applications are not counted on holidays.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeLeave;
