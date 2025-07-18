import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Chip } from '@mui/material';
import api from '../../services/api';

const statusColors = {
  'Submitted': 'info',
  'Under Review': 'warning',
  'Approved': 'success',
  'Denied': 'error',
};

const AdminLoanTable = () => {
  const [loans, setLoans] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans/all');
      setLoans(res.data);
    } catch (err) {
      setLoans([]);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const filteredLoans = loans.filter(l =>
    (l.user?.name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (l.status?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === filteredLoans.length) setSelected([]);
    else setSelected(filteredLoans.map(l => l._id));
  };
  const handleBulkApprove = async () => {
    await Promise.all(selected.map(id => api.patch(`/loans/${id}/status`, { status: 'Approved' })));
    setSelected([]);
    fetchLoans();
  };
  const handleBulkReject = async () => {
    await Promise.all(selected.map(id => api.patch(`/loans/${id}/status`, { status: 'Denied' })));
    setSelected([]);
    fetchLoans();
  };
  const handleStatus = async (id, status) => {
    await api.patch(`/loans/${id}/status`, { status });
    fetchLoans();
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField label="Search by user or status" value={filter} onChange={e => setFilter(e.target.value)} variant="outlined" />
        <Button variant="contained" color="success" onClick={handleBulkApprove} disabled={!selected.length}>Bulk Approve</Button>
        <Button variant="contained" color="error" onClick={handleBulkReject} disabled={!selected.length}>Bulk Reject</Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={selected.length === filteredLoans.length && filteredLoans.length > 0} onChange={handleSelectAll} />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoans.map(loan => (
              <TableRow key={loan._id} selected={selected.includes(loan._id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(loan._id)} onChange={() => handleSelect(loan._id)} />
                </TableCell>
                <TableCell>{loan.user?.name || loan.user}</TableCell>
                <TableCell>₹{loan.amount}</TableCell>
                <TableCell><Chip label={loan.status} color={statusColors[loan.status]} /></TableCell>
                <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><Button size="small" onClick={() => setDetail(loan)}>View</Button></TableCell>
                <TableCell>
                  {loan.status !== 'Approved' && loan.status !== 'Denied' && (
                    <Stack spacing={1} direction="row">
                      <Button variant="contained" color="success" size="small" onClick={() => handleStatus(loan._id, 'Approved')}>Approve</Button>
                      <Button variant="contained" color="error" size="small" onClick={() => handleStatus(loan._id, 'Denied')}>Reject</Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!detail} onClose={() => setDetail(null)}>
        <DialogTitle>Loan Details</DialogTitle>
        <DialogContent>
          {detail && (
            <>
              <Typography>User: {detail.user?.name || detail.user}</Typography>
              <Typography>Amount: ₹{detail.amount}</Typography>
              <Typography>Status: {detail.status}</Typography>
              <Typography>Date: {new Date(detail.createdAt).toLocaleDateString()}</Typography>
              {/* Add more details as needed */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminLoanTable; 