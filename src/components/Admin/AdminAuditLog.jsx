import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Box, CircularProgress } from '@mui/material';
import api from '../../services/api';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const AdminAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('timestamp');

  useEffect(() => {
    setLoading(true);
    api.get('/audit-logs')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch audit logs.');
        setLoading(false);
      });
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLogs = [...logs].sort(getComparator(order, orderBy));

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" mb={2}>Audit Log</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'timestamp'}
                    direction={orderBy === 'timestamp' ? order : 'asc'}
                    onClick={() => handleSort('timestamp')}
                  >
                    Timestamp
                  </TableSortLabel>
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AdminAuditLog; 