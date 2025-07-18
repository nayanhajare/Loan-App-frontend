import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, MenuItem, Stack } from '@mui/material';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={4} borderRadius={3} sx={{ bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} color="text.primary">Register</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Name" fullWidth margin="normal" {...register('name', { required: true })} variant="outlined" />
        <TextField label="Email" fullWidth margin="normal" {...register('email', { required: true })} variant="outlined" />
        <TextField label="Password" type="password" fullWidth margin="normal" {...register('password', { required: true })} variant="outlined" />
        <TextField select label="Role" fullWidth margin="normal" defaultValue="user" {...register('role', { required: true })} variant="outlined">
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
      </form>
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Link to="/login" style={{ color: 'var(--color-link)' }}>Already have an account? Login</Link>
      </Stack>
    </Box>
  );
};

export default Register; 