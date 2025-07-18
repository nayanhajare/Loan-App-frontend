import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatSupportStub from '../components/User/ChatSupportStub';
import { useNotification } from '../components/NotificationProvider';

const statusColors = {
  'Paid': 'success',
  'Overdue': 'error',
  'Upcoming': 'warning',
};

const RepaymentCalendar = () => {
  const { user } = useAuth();
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loanRes = user.role === 'admin'
          ? await api.get('/loans/all')
          : await api.get('/loans/my');
        let allRepayments = [];
        for (const loan of loanRes.data) {
          const res = await api.get(`/loans/${loan._id}/repayments`);
          allRepayments = allRepayments.concat(res.data.map(r => ({ ...r, loanAmount: loan.amount, loanId: loan._id })));
        }
        setRepayments(allRepayments);
      } catch {
        setRepayments([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleDownloadCSV = () => {
    const header = 'Due Date,Amount,Status,Loan Amount,Paid At\n';
    const rows = repayments.map(r => [
      new Date(r.dueDate).toLocaleDateString(),
      r.amount,
      r.status,
      r.loanAmount,
      r.paidAt ? new Date(r.paidAt).toLocaleDateString() : '-'
    ].join(','));
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repayment_schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMarkPaid = async (loanId, repaymentId) => {
    await api.patch(`/loans/${loanId}/repayments/${repaymentId}/paid`);
    // Refresh repayments
    const loanRes = user.role === 'admin'
      ? await api.get('/loans/all')
      : await api.get('/loans/my');
    let allRepayments = [];
    for (const loan of loanRes.data) {
      const res = await api.get(`/loans/${loan._id}/repayments`);
      allRepayments = allRepayments.concat(res.data.map(r => ({ ...r, loanAmount: loan.amount, loanId: loan._id })));
    }
    setRepayments(allRepayments);
  };

  // Demo: Simulate payment for an EMI
  const handleDemoPay = async (loanId, repaymentId) => {
    try {
      // Simulate payment delay
      await new Promise(res => setTimeout(res, 1200));
      await handleMarkPaid(loanId, repaymentId);
      notify('EMI payment successful!', 'success');
    } catch {
      notify('Payment failed. Please try again.', 'error');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!repayments.length) return <Typography>No repayments found.</Typography>;

  // Find most recent paid EMI and next due EMI
  const paidRepayments = repayments.filter(r => r.status === 'Paid').sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  const upcomingRepayments = repayments.filter(r => r.status === 'Upcoming').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const recentEMI = paidRepayments[0];
  const nextDue = upcomingRepayments[0];

  return (
    <Box maxWidth={900} mx="auto" mt={8}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleDownloadCSV}>Download Repayment Schedule (CSV)</Button>
      </Stack>
      <Typography variant="h5" mb={2} color="text.primary">Repayment Calendar</Typography>
      {/* Recent EMI and Next Due Section */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
        <Box flex={1} p={3} bgcolor="background.paper" borderRadius={3} boxShadow={2}>
          <Typography variant="subtitle1" color="primary" fontWeight={700} mb={1}>Most Recent EMI Paid</Typography>
          {recentEMI ? (
            <>
              <Typography>Amount: <b>₹{recentEMI.amount}</b></Typography>
              <Typography>Paid On: <b>{recentEMI.paidAt ? new Date(recentEMI.paidAt).toLocaleDateString() : '-'}</b></Typography>
              <Typography>Status: <b>Paid</b></Typography>
            </>
          ) : <Typography color="text.secondary">No EMI paid yet.</Typography>}
        </Box>
        <Box flex={1} p={3} bgcolor="background.paper" borderRadius={3} boxShadow={2}>
          <Typography variant="subtitle1" color="secondary" fontWeight={700} mb={1}>Next Payment Due</Typography>
          {nextDue ? (
            <>
              <Typography>Amount: <b>₹{nextDue.amount}</b></Typography>
              <Typography>Due Date: <b>{new Date(nextDue.dueDate).toLocaleDateString()}</b></Typography>
              <Typography>Status: <b>Upcoming</b></Typography>
            </>
          ) : <Typography color="text.secondary">No upcoming payment due.</Typography>}
        </Box>
      </Stack>
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Due Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repayments.map(r => (
              <TableRow key={r._id}>
                <TableCell>{new Date(r.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>₹{r.amount}</TableCell>
                <TableCell><Chip label={r.status} color={statusColors[r.status]} /></TableCell>
                <TableCell>₹{r.loanAmount}</TableCell>
                <TableCell>{r.paidAt ? new Date(r.paidAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  {r.status !== 'Paid' && (
                    <Button size="small" variant="contained" color="success" onClick={() => handleDemoPay(r.loanId, r._id)}>
                      Pay Now
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ChatSupportStub />
    </Box>
  );
};

export default RepaymentCalendar; 