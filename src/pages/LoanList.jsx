import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, LinearProgress, Button, Stack, Chip, Paper, Collapse, Switch, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoanTimeline from '../components/User/LoanTimeline';
import ChatSupportStub from '../components/User/ChatSupportStub';

const statusSteps = ['Submitted', 'Under Review', 'Approved', 'Denied'];
const statusColors = {
  'Submitted': 'info',
  'Under Review': 'warning',
  'Approved': 'success',
  'Denied': 'error',
};

const LoanList = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = user.role === 'admin'
        ? await api.get('/loans/all')
        : await api.get('/loans/my');
      setLoans(res.data);
    } catch (err) {
      setLoans([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleStatus = async (id, status) => {
    await api.patch(`/loans/${id}/status`, { status });
    fetchLoans();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!loans.length) return <Typography>No loans found.</Typography>;

  return (
    <Box maxWidth={800} mx="auto" mt={8}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h5" mb={2} color="text.primary">Loan Status Dashboard</Typography>
      <FormControlLabel control={<Switch checked={showAdvanced} onChange={() => setShowAdvanced(v => !v)} />} label="Show Advanced Details" />
      <Stack spacing={2}>
        {loans.map(loan => (
          <Paper key={loan._id} sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" color="text.primary">Loan Amount: ₹{loan.amount}</Typography>
                {/* Fix: Use Box for Status row to avoid <div> inside <p> */}
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography component="span" sx={{ mr: 1 }}>Status:</Typography>
                  <Chip label={loan.status} color={statusColors[loan.status]} />
                </Box>
                <LinearProgress variant="determinate" value={statusSteps.indexOf(loan.status) * 33.3} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Typography component="span" variant="body2" sx={{ mr: 1 }}>Documents:</Typography>
                  {loan.documents?.length ? loan.documents.map(doc => (
                    <Chip key={doc._id} label={doc.status} color={statusColors[doc.status] || 'default'} size="small" sx={{ mr: 1, mb: 0.5 }} />
                  )) : <Typography component="span" variant="body2">No documents</Typography>}
                </Box>
                <Collapse in={showAdvanced}>
                  <LoanTimeline history={loan.history || []} />
                </Collapse>
              </Box>
              {user.role === 'admin' && loan.status !== 'Approved' && loan.status !== 'Denied' && (
                <Stack spacing={1}>
                  <Button variant="contained" color="success" onClick={() => handleStatus(loan._id, 'Approved')}>Approve</Button>
                  <Button variant="contained" color="error" onClick={() => handleStatus(loan._id, 'Denied')}>Reject</Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
      <ChatSupportStub />
    </Box>
  );
};

export default LoanList; 