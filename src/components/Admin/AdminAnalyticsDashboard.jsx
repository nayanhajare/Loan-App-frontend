import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box, CircularProgress } from '@mui/material';
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

  // Prepare data for charts
  // 1. Loans over time (by month)
  const loansByMonth = {};
  loans.forEach(loan => {
    const d = new Date(loan.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    loansByMonth[key] = (loansByMonth[key] || 0) + 1;
  });
  const loansOverTime = Object.entries(loansByMonth).map(([month, count]) => ({ month, count }));

  // 2. Loan type distribution
  const typeCounts = {};
  loans.forEach(loan => {
    const type = loan.type || 'Other';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const loanTypeData = Object.entries(typeCounts).map(([type, value]) => ({ name: type, value }));

  // 3. Approval rates
  let approved = 0, rejected = 0, pending = 0;
  loans.forEach(loan => {
    if (loan.status === 'Approved') approved++;
    else if (loan.status === 'Denied') rejected++;
    else pending++;
  });
  const approvalData = [
    { name: 'Approved', value: approved },
    { name: 'Rejected', value: rejected },
    { name: 'Pending', value: pending },
  ];

  // 4. User growth over time (by month)
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
      )}
    </Paper>
  );
};

export default AdminAnalyticsDashboard; 