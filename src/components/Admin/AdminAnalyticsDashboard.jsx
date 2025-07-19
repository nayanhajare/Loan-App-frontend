import React, { useEffect, useState } from 'react';
import { Paper, Typography, Stack, Box, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import api from '../../services/api';

const COLORS = ['#1976d2', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#8d6e63'];

const AdminAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/loans/all'),
      api.get('/users'),
    ])
      .then(([loansRes, usersRes]) => {
        setLoans(loansRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch analytics data.');
        setLoading(false);
      });
  }, []);

  // Summary stats
  const totalLoans = loans.length;
  const approved = loans.filter(l => l.status === 'Approved').length;
  const rejected = loans.filter(l => l.status === 'Denied').length;
  const pending = loans.filter(l => l.status !== 'Approved' && l.status !== 'Denied').length;

  // Prepare data for charts (same as before)
  const loansByMonth = {};
  loans.forEach(loan => {
    const d = new Date(loan.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    loansByMonth[key] = (loansByMonth[key] || 0) + 1;
  });
  const loansOverTime = Object.entries(loansByMonth).map(([month, count]) => ({ month, count }));

  const typeCounts = {};
  loans.forEach(loan => {
    const type = loan.type || 'Other';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const loanTypeData = Object.entries(typeCounts).map(([type, value]) => ({ name: type, value }));

  let appr = 0, rej = 0, pend = 0;
  loans.forEach(loan => {
    if (loan.status === 'Approved') appr++;
    else if (loan.status === 'Denied') rej++;
    else pend++;
  });
  const approvalData = [
    { name: 'Approved', value: appr },
    { name: 'Rejected', value: rej },
    { name: 'Pending', value: pend },
  ];

  const usersByMonth = {};
  users.forEach(user => {
    const d = new Date(user.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    usersByMonth[key] = (usersByMonth[key] || 0) + 1;
  });
  const userGrowth = Object.entries(usersByMonth).map(([month, count]) => ({ month, count }));

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={3} fontWeight={700} color="primary.main">Analytics Dashboard</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Summary boxes */}
          <Stack direction="row" spacing={4} mb={4} justifyContent="center">
            <Box textAlign="center">
              <Typography variant="h4" color="primary.main">{totalLoans}</Typography>
              <Typography color="text.secondary">Total Loans</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">{approved}</Typography>
              <Typography color="text.secondary">Approved</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main">{pending}</Typography>
              <Typography color="text.secondary">Pending</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="error.main">{rejected}</Typography>
              <Typography color="text.secondary">Rejected</Typography>
            </Box>
          </Stack>
          {/* Advanced charts */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Loans Over Time</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={loansOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Loan Type Distribution</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={loanTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {loanTypeData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Approval Rates</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={approvalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {approvalData.map((entry, idx) => (
                      <Cell key={`cell-appr-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>User Growth Over Time</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default AdminAnalyticsDashboard; 