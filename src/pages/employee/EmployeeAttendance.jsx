import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
    ClockIcon,
    MapPinIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Generate mock attendance for current month
const generateMonthData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const holidays = [14, 21]; // Holi + weekend catch
    const data = {};

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayOfWeek = date.getDay();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            data[dateStr] = { status: 'weekend' };
        } else if (holidays.includes(d)) {
            data[dateStr] = { status: 'holiday', name: d === 14 ? 'Holi' : 'Holiday' };
        } else if (d > today) {
            data[dateStr] = { status: 'future' };
        } else if (d === today) {
            data[dateStr] = { status: 'present', checkIn: '09:12 AM', checkOut: null };
        } else {
            const rand = Math.random();
            if (rand < 0.75) {
                data[dateStr] = { status: 'present', checkIn: `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')} AM`, checkOut: `06:${String(Math.floor(Math.random() * 30)).padStart(2, '0')} PM' }` };
            } else if (rand < 0.85) {
                data[dateStr] = { status: 'wfh', checkIn: '09:30 AM', checkOut: '06:00 PM' };
            } else if (rand < 0.92) {
                data[dateStr] = { status: 'leave', leaveType: 'CL' };
            } else {
                data[dateStr] = { status: 'absent' };
            }
        }
    }
    return data;
};

const statusConfig = {
    present: { label: 'Present', short: 'P', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    wfh: { label: 'WFH', short: 'W', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    leave: { label: 'On Leave', short: 'L', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    absent: { label: 'Absent', short: 'A', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    holiday: { label: 'Holiday', short: 'H', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
    weekend: { label: 'Weekend', short: '—', color: 'bg-gray-50 text-gray-300 border-gray-100', dot: '' },
    future: { label: '—', short: '·', color: 'bg-gray-50 text-gray-300 border-gray-100', dot: '' },
};

const EmployeeAttendance = () => {
    const [monthData] = useState(generateMonthData);
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const saved = localStorage.getItem(`attendance_${today}`);
        if (saved) {
            const d = JSON.parse(saved);
            setCheckedIn(d.checkedIn || false);
            setCheckInTime(d.checkInTime || null);
            setCheckOutTime(d.checkOutTime || null);
        }
    }, [today]);

    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleCheckIn = () => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        setCheckedIn(true);
        setCheckInTime(time);
        localStorage.setItem(`attendance_${today}`, JSON.stringify({ checkedIn: true, checkInTime: time, date: today }));
        toast.success(`Checked in at ${time}`);
    };

    const handleCheckOut = () => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        setCheckedIn(false);
        setCheckOutTime(time);
        localStorage.setItem(`attendance_${today}`, JSON.stringify({ checkedIn: false, checkInTime, checkOutTime: time, date: today }));
        toast.success(`Checked out at ${time}`);
    };

    // Stats
    const entries = Object.values(monthData);
    const stats = {
        present: entries.filter(e => e.status === 'present').length,
        wfh: entries.filter(e => e.status === 'wfh').length,
        leave: entries.filter(e => e.status === 'leave').length,
        absent: entries.filter(e => e.status === 'absent').length,
    };

    // Build calendar rows
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
                    <p className="text-gray-500 mt-1">Track your daily attendance and check-in status</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Clock-in Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Live Time</p>
                            <p className="text-4xl font-mono font-bold text-gray-900 mt-1">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border-2 text-center ${checkInTime ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                                <p className="text-xs text-gray-400 font-medium mb-1">Check In</p>
                                <p className={`text-sm font-bold ${checkInTime ? 'text-green-700' : 'text-gray-300'}`}>{checkInTime || '--:--'}</p>
                            </div>
                            <div className={`p-3 rounded-xl border-2 text-center ${checkOutTime ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-gray-50'}`}>
                                <p className="text-xs text-gray-400 font-medium mb-1">Check Out</p>
                                <p className={`text-sm font-bold ${checkOutTime ? 'text-indigo-700' : 'text-gray-300'}`}>{checkOutTime || '--:--'}</p>
                            </div>
                        </div>

                        {!checkedIn ? (
                            <button
                                onClick={handleCheckIn}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-green-400/30 flex items-center justify-center gap-2"
                            >
                                <ClockIcon className="w-5 h-5" /> Check In
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckOut}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-red-400/30 flex items-center justify-center gap-2"
                            >
                                <ClockIcon className="w-5 h-5" /> Check Out
                            </button>
                        )}
                        <button
                            onClick={() => toast.success('WFH marked for today!')}
                            className="w-full border-2 border-blue-200 text-blue-700 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
                        >
                            <ComputerDesktopIcon className="w-4 h-4" /> Mark WFH
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">{monthName} Summary</h2>
                        {[
                            { label: 'Present', value: stats.present, icon: CheckCircleIcon, color: 'text-green-600 bg-green-100' },
                            { label: 'Work From Home', value: stats.wfh, icon: ComputerDesktopIcon, color: 'text-blue-600 bg-blue-100' },
                            { label: 'On Leave', value: stats.leave, icon: CalendarDaysIcon, color: 'text-yellow-600 bg-yellow-100' },
                            { label: 'Absent', value: stats.absent, icon: XCircleIcon, color: 'text-red-600 bg-red-100' },
                        ].map((s) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">{s.label}</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Legend</h3>
                        <div className="space-y-2">
                            {Object.entries(statusConfig)
                                .filter(([k]) => !['weekend', 'future'].includes(k))
                                .map(([key, cfg]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${cfg.color}`}>
                                            {cfg.short}
                                        </div>
                                        <span className="text-sm text-gray-600">{cfg.label}</span>
                                    </div>
                                ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Working hours: 9:00 AM – 6:00 PM</p>
                            <p className="text-xs text-gray-400 mt-1">Late mark after: 9:30 AM</p>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">{monthName}</h2>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {calendarCells.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} />;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const entry = monthData[dateStr];
                            const cfg = entry ? statusConfig[entry.status] : statusConfig.future;
                            const isToday = day === now.getDate();

                            return (
                                <div
                                    key={day}
                                    title={entry?.status === 'holiday' ? entry.name : cfg.label}
                                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-semibold cursor-default transition hover:scale-105 ${cfg.color} ${isToday ? 'ring-2 ring-purple-500 ring-offset-1' : ''}`}
                                >
                                    <span className={`text-sm font-bold ${isToday ? 'text-purple-700' : ''}`}>{day}</span>
                                    <span className="text-[10px] opacity-70 mt-0.5">{cfg.short}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeAttendance;
