import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
    DocumentArrowDownIcon,
    CurrencyRupeeIcon,
    PrinterIcon,
    XMarkIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const payslips = [
    { month: 'February 2026', status: 'paid', processedOn: '28 Feb 2026', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
    { month: 'January 2026', status: 'paid', processedOn: '31 Jan 2026', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
    { month: 'December 2025', status: 'paid', processedOn: '31 Dec 2025', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
    { month: 'November 2025', status: 'paid', processedOn: '30 Nov 2025', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
    { month: 'October 2025', status: 'paid', processedOn: '31 Oct 2025', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
    { month: 'September 2025', status: 'paid', processedOn: '30 Sep 2025', basic: 35000, hra: 14000, transport: 2000, medical: 1250, pf: 4200, tax: 3500, netPay: 44550 },
];

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

const PayslipModal = ({ slip, onClose, user }) => {
    if (!slip) return null;

    const grossPay = slip.basic + slip.hra + slip.transport + slip.medical;
    const totalDeductions = slip.pf + slip.tax;

    const handlePrint = () => {
        window.print();
        toast.success('Printing payslip...');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Payslip – {slip.month}</h2>
                            <p className="text-purple-200 text-sm mt-1">Processed on {slip.processedOn}</p>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 bg-white/10 rounded-xl p-4">
                        <div>
                            <p className="text-xs text-purple-200 uppercase">Employee</p>
                            <p className="font-semibold">{user?.name || 'Ravi Kumar'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-200 uppercase">Employee ID</p>
                            <p className="font-semibold">EMP-024</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-200 uppercase">Designation</p>
                            <p className="font-semibold">Software Developer</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-200 uppercase">Department</p>
                            <p className="font-semibold">Engineering</p>
                        </div>
                    </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Earnings */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Earnings
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Basic Salary', amount: slip.basic },
                                    { label: 'HRA', amount: slip.hra },
                                    { label: 'Transport Allowance', amount: slip.transport },
                                    { label: 'Medical Allowance', amount: slip.medical },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-50">
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-semibold text-gray-900">{fmt(item.amount)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-2 bg-green-50 rounded-lg px-2 mt-2">
                                    <span className="text-sm font-bold text-green-700">Gross Pay</span>
                                    <span className="text-sm font-bold text-green-700">{fmt(grossPay)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400" /> Deductions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Provident Fund (PF)', amount: slip.pf },
                                    { label: 'Income Tax (TDS)', amount: slip.tax },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-50">
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-semibold text-red-600">- {fmt(item.amount)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-2 bg-red-50 rounded-lg px-2 mt-2">
                                    <span className="text-sm font-bold text-red-700">Total Deductions</span>
                                    <span className="text-sm font-bold text-red-700">- {fmt(totalDeductions)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-5 text-center">
                        <p className="text-sm text-purple-200 uppercase tracking-wide">Net Pay</p>
                        <p className="text-4xl font-bold mt-1">{fmt(slip.netPay)}</p>
                        <p className="text-purple-200 text-sm mt-1">Amount to be credited to your bank account</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition"
                        >
                            <PrinterIcon className="w-5 h-5" /> Print Payslip
                        </button>
                        <button
                            onClick={() => { toast.success('Payslip downloaded!'); onClose(); }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmployeePayslips = () => {
    const { user } = useAuth();
    const [selectedSlip, setSelectedSlip] = useState(null);
    const annualEarnings = payslips.reduce((sum, s) => sum + s.netPay, 0);

    return (
        <DashboardLayout>
            {selectedSlip && (
                <PayslipModal slip={selectedSlip} onClose={() => setSelectedSlip(null)} user={user} />
            )}

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Payslips</h1>
                    <p className="text-gray-500 mt-1">View and download your monthly salary slips</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-5">
                        <p className="text-sm text-purple-200">YTD Earnings (2026)</p>
                        <p className="text-3xl font-bold mt-1">{fmt(annualEarnings)}</p>
                        <p className="text-xs text-purple-200 mt-1">Apr 2025 – Feb 2026</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Last Month Net Pay</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{fmt(payslips[0].netPay)}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" /> Credited on {payslips[0].processedOn}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-sm text-gray-500">CTC (Annual)</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">₹6,30,000</p>
                        <p className="text-xs text-gray-400 mt-1">Gross annual compensation</p>
                    </div>
                </div>

                {/* Payslip List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-purple-600" /> Payslip History
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {payslips.map((slip, i) => (
                            <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 transition group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <CurrencyRupeeIcon className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{slip.month}</p>
                                        <p className="text-sm text-gray-500">Processed on {slip.processedOn}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="font-bold text-gray-900">{fmt(slip.netPay)}</p>
                                        <p className="text-xs text-gray-400">Net Pay</p>
                                    </div>
                                    {slip.status === 'paid' ? (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                            <CheckCircleIcon className="w-3.5 h-3.5" /> Paid
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                                            <ClockIcon className="w-3.5 h-3.5" /> Pending
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setSelectedSlip(slip)}
                                        className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-purple-100 group-hover:text-purple-700 text-gray-500 transition"
                                        title="View & Download"
                                    >
                                        <DocumentArrowDownIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeePayslips;
