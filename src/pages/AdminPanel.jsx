import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminLoanTable from '../components/Admin/AdminLoanTable';
import AdminAnalyticsDashboard from '../components/Admin/AdminAnalyticsDashboard';
import AdminUserManagement from '../components/Admin/AdminUserManagement';
import AdminAuditLog from '../components/Admin/AdminAuditLog';

const handleExportCSV = () => {
  // TODO: Replace with real data export
  alert('Export data as CSV (feature coming soon)');
};

const AdminPanel = () => {
  const navigate = useNavigate();
  return (
    <Box maxWidth={1200} mx="auto" mt={8} p={3} boxShadow={4} borderRadius={3} sx={{ bgcolor: 'background.paper' }}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h5" mb={2} color="text.primary">Admin Panel</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleExportCSV}>Export Data (CSV)</Button>
      </Stack>
      <AdminAnalyticsDashboard />
      <AdminLoanTable />
      <AdminUserManagement />
      <AdminAuditLog />
    </Box>
  );
};

export default AdminPanel; 