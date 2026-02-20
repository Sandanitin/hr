import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import LeaveManagement from './pages/LeaveManagement'
import Attendance from './pages/Attendance'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import HRAdminDashboard from './pages/admin/HRAdminDashboard'
import HREmployees from './pages/hr/HREmployees'
import HRLeaveApprovals from './pages/hr/HRLeaveApprovals'
import HRAttendance from './pages/hr/HRAttendance'
import HRCalendar from './pages/hr/HRCalendar'
import HRProvidentFund from './pages/hr/HRProvidentFund'
import HRPayroll from './pages/hr/HRPayroll'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import Finances from './pages/Finances'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute>
              <HREmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/leaves"
          element={
            <ProtectedRoute>
              <HRLeaveApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute>
              <HRAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/calendar"
          element={
            <ProtectedRoute>
              <HRCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/pf"
          element={
            <ProtectedRoute>
              <HRProvidentFund />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <ProtectedRoute>
              <HRPayroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances"
          element={
            <ProtectedRoute>
              <Finances />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App

