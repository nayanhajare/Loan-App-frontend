import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem } from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    // TODO: Implement backend role update
    setUsers(users.map(u => u._id === id ? { ...u, role } : u));
  };
  const handleDeactivate = async (id) => {
    // TODO: Implement backend deactivate
    setUsers(users.map(u => u._id === id ? { ...u, active: false } : u));
  };
  const handleReset = (id) => {
    // TODO: Implement backend reset password
    alert('Reset password for user: ' + id);
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" mb={2}>User Management</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} disabled={u._id === user.id}>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{u.active !== false ? 'Active' : 'Deactivated'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleReset(u._id)} disabled={u._id === user.id}>Reset Password</Button>
                  <Button size="small" color="error" onClick={() => handleDeactivate(u._id)} disabled={u._id === user.id || u.active === false}>Deactivate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminUserManagement; 