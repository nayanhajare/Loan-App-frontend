import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderCustom } from './context/ThemeContext';
import { NotificationProvider } from './components/NotificationProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLoan from './pages/ApplyLoan';
import LoanList from './pages/LoanList';
import RepaymentCalendar from './pages/RepaymentCalendar';
import LoanComparison from './pages/LoanComparison';
import AdminPanel from './pages/AdminPanel';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';

const UserOnlyRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

const App = () => (
  <ThemeProviderCustom>
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apply" element={<ProtectedRoute><UserOnlyRoute><ApplyLoan /></UserOnlyRoute></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><UserOnlyRoute><LoanList /></UserOnlyRoute></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><UserOnlyRoute><RepaymentCalendar /></UserOnlyRoute></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><UserOnlyRoute><LoanComparison /></UserOnlyRoute></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  </ThemeProviderCustom>
);

export default App;
