import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={4} borderRadius={3} sx={{ bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} color="text.primary">Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Email" fullWidth margin="normal" {...register('email', { required: true })} variant="outlined" />
        <TextField label="Password" type="password" fullWidth margin="normal" {...register('password', { required: true })} variant="outlined" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
      </form>
      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Link to="/register" style={{ color: 'var(--color-link)' }}>Don't have an account? Register</Link>
        <Link to="/forgot-password" style={{ color: 'var(--color-link)' }}>Forgot Password?</Link>
      </Stack>
    </Box>
  );
};

export default Login; 