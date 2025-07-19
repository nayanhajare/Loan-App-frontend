import React from 'react';
import { Paper, Typography, Stack, Box } from '@mui/material';

const AdminAnalyticsDashboard = () => (
  <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h6" mb={2}>Analytics Dashboard</Typography>
    <Stack direction="row" spacing={4} mb={2}>
      <Box>
        <Typography variant="h4">12</Typography>
        <Typography color="text.secondary">Total Loans</Typography>
      </Box>
      <Box>
        <Typography variant="h4">5</Typography>
        <Typography color="text.secondary">Approved</Typography>
      </Box>
      <Box>
        <Typography variant="h4">3</Typography>
        <Typography color="text.secondary">Pending</Typography>
      </Box>
      <Box>
        <Typography variant="h4">2</Typography>
        <Typography color="text.secondary">Rejected</Typography>
      </Box>
    </Stack>
    {/* TODO: Add charts using recharts or chart.js for visual analytics */}
    <Typography color="text.secondary">(Charts and more analytics coming soon!)</Typography>
  </Paper>
);

export default AdminAnalyticsDashboard; 