import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset-password', { token, password });
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={4} borderRadius={3} sx={{ bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} color="text.primary">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="New Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required variant="outlined" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Reset Password</Button>
      </form>
      {message && <Typography mt={2} color="text.secondary">{message}</Typography>}
    </Box>
  );
};

export default ResetPassword; 