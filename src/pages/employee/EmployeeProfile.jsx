import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
    UserCircleIcon,
    BriefcaseIcon,
    BanknotesIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    CloudArrowUpIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserCircleIcon },
    { id: 'job', label: 'Job Details', icon: BriefcaseIcon },
    { id: 'bank', label: 'Bank Details', icon: BanknotesIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
];

const documents = [
    { name: 'Aadhaar Card', status: 'verified', date: '2023-01-10', size: '1.2 MB' },
    { name: 'PAN Card', status: 'verified', date: '2023-01-10', size: '0.8 MB' },
    { name: 'Offer Letter', status: 'verified', date: '2023-03-01', size: '2.1 MB' },
    { name: 'Education Certificate', status: 'pending', date: '2023-01-15', size: '3.4 MB' },
    { name: 'Experience Letter', status: 'pending', date: null, size: null },
];

const EmployeeProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [editing, setEditing] = useState(false);

    const handleSave = () => {
        setEditing(false);
        toast.success('Profile updated successfully!');
    };

    const renderPersonal = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { label: 'Full Name', value: user?.name || 'Ravi Kumar' },
                { label: 'Email Address', value: user?.email || 'ravi.kumar@vikrin.com' },
                { label: 'Phone Number', value: '+91 98765 43210' },
                { label: 'Date of Birth', value: '15 Aug 1995' },
                { label: 'Gender', value: 'Male' },
                { label: 'Blood Group', value: 'B+' },
                { label: 'Marital Status', value: 'Single' },
                { label: 'Nationality', value: 'Indian' },
            ].map((field) => (
                <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{field.label}</label>
                    {editing ? (
                        <input
                            defaultValue={field.value}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        />
                    ) : (
                        <p className="text-gray-900 font-medium py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">{field.value}</p>
                    )}
                </div>
            ))}
            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Address</label>
                {editing ? (
                    <textarea
                        defaultValue="123, MG Road, Koramangala, Bengaluru – 560034"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                ) : (
                    <p className="text-gray-900 font-medium py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                        123, MG Road, Koramangala, Bengaluru – 560034
                    </p>
                )}
            </div>
            <div className="md:col-span-2 border-t pt-4">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Name', value: 'Sunita Kumar' },
                        { label: 'Relationship', value: 'Mother' },
                        { label: 'Phone', value: '+91 99887 76543' },
                    ].map((f) => (
                        <div key={f.label}>
                            <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                            {editing ? (
                                <input defaultValue={f.value} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm" />
                            ) : (
                                <p className="text-gray-800 font-medium text-sm py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">{f.value}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderJob = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { label: 'Employee ID', value: 'EMP-024', readOnly: true },
                { label: 'Department', value: 'Engineering', readOnly: true },
                { label: 'Designation', value: 'Software Developer', readOnly: true },
                { label: 'Date of Joining', value: '01 March 2023', readOnly: true },
                { label: 'Employment Type', value: 'Full-time', readOnly: true },
                { label: 'Work Location', value: 'Bengaluru Office', readOnly: true },
                { label: 'Reporting Manager', value: 'Ankit Sharma', readOnly: true },
                { label: 'Company', value: user?.company || 'Vikrin', readOnly: true },
            ].map((field) => (
                <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{field.label}</label>
                    <p className={`text-gray-900 font-medium py-2 px-3 rounded-lg border ${field.readOnly ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-50 border-gray-100'}`}>
                        {field.value}
                    </p>
                </div>
            ))}
            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-semibold">ℹ️ Job details can only be updated by HR. Please raise a request if any changes are needed.</p>
            </div>
        </div>
    );

    const renderBank = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Account Holder Name', value: 'Ravi Kumar' },
                    { label: 'Bank Name', value: 'HDFC Bank' },
                    { label: 'Account Number', value: '••••••••7890' },
                    { label: 'IFSC Code', value: 'HDFC0001234' },
                    { label: 'Branch', value: 'Koramangala, Bengaluru' },
                    { label: 'Account Type', value: 'Savings' },
                ].map((field) => (
                    <div key={field.label}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{field.label}</label>
                        {editing ? (
                            <input defaultValue={field.value} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                        ) : (
                            <p className="text-gray-900 font-medium py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">{field.value}</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs text-yellow-700 font-semibold">⚠️ Bank account changes require verification. Your updated details will be reviewed by HR before activation.</p>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Upload and manage your HR documents</p>
                <button
                    onClick={() => toast.success('File upload coming soon!')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition"
                >
                    <CloudArrowUpIcon className="w-4 h-4" /> Upload Document
                </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['Document', 'Status', 'Uploaded On', 'Size', 'Action'].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {documents.map((doc, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                                    <DocumentTextIcon className="w-4 h-4 text-gray-400" /> {doc.name}
                                </td>
                                <td className="px-4 py-3">
                                    {doc.status === 'verified' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            <CheckCircleIcon className="w-3 h-3" /> Verified
                                        </span>
                                    ) : doc.date ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Not Uploaded</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-500">{doc.date || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{doc.size || '—'}</td>
                                <td className="px-4 py-3">
                                    {doc.date ? (
                                        <button
                                            onClick={() => toast.success(`Downloading ${doc.name}...`)}
                                            className="text-purple-600 hover:text-purple-800 font-medium text-xs"
                                        >
                                            Download
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => toast.success('File upload coming soon!')}
                                            className="text-gray-400 hover:text-gray-600 font-medium text-xs"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'personal': return renderPersonal();
            case 'job': return renderJob();
            case 'bank': return renderBank();
            case 'documents': return renderDocuments();
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16" />
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-xl z-10">
                        {user?.name?.charAt(0) || 'R'}
                    </div>
                    <div className="z-10 text-center md:text-left">
                        <h1 className="text-2xl font-bold">{user?.name || 'Ravi Kumar'}</h1>
                        <p className="text-purple-200 mt-1">Software Developer · Engineering</p>
                        <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">EMP-024</span>
                            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Joined: 01 Mar 2023</span>
                            <span className="text-xs bg-green-500/30 text-green-100 px-3 py-1 rounded-full">● Active</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setEditing(false); }}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                            ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="p-6">
                        {/* Tab Actions */}
                        {activeTab !== 'documents' && activeTab !== 'job' && (
                            <div className="flex justify-end mb-6">
                                {editing ? (
                                    <div className="flex gap-3">
                                        <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition">Save Changes</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 transition"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" /> Edit
                                    </button>
                                )}
                            </div>
                        )}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeProfile;
