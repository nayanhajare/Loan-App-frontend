import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoanComparison = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ type: '', minRate: '', maxRate: '' });
  const [calc, setCalc] = useState({ amount: '', interestRate: '', term: '' });
  const [calcResult, setCalcResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/loan-products', { params: filters });
      setProducts(res.data);
    };
    fetchProducts();
  }, [filters]);

  const handleCalc = async () => {
    const res = await api.post('/loan-products/calculate', calc);
    setCalcResult(res.data);
  };

  return (
    <Box maxWidth={900} mx="auto" mt={8}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h5" mb={2} color="text.primary">Loan Comparison Tool</Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField label="Type" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} variant="outlined" />
        <TextField label="Min Rate" type="number" value={filters.minRate} onChange={e => setFilters(f => ({ ...f, minRate: e.target.value }))} variant="outlined" />
        <TextField label="Max Rate" type="number" value={filters.maxRate} onChange={e => setFilters(f => ({ ...f, maxRate: e.target.value }))} variant="outlined" />
      </Box>
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Interest Rate (%)</TableCell>
              <TableCell>Min Amount</TableCell>
              <TableCell>Max Amount</TableCell>
              <TableCell>Min Term</TableCell>
              <TableCell>Max Term</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.type}</TableCell>
                <TableCell>{p.interestRate}</TableCell>
                <TableCell>₹{p.minAmount}</TableCell>
                <TableCell>₹{p.maxAmount}</TableCell>
                <TableCell>{p.minTerm} mo</TableCell>
                <TableCell>{p.maxTerm} mo</TableCell>
                <TableCell>{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Typography variant="h6">Dynamic Loan Calculator</Typography>
        <Box display="flex" gap={2} mt={1}>
          <TextField label="Amount" type="number" value={calc.amount} onChange={e => setCalc(c => ({ ...c, amount: e.target.value }))} variant="outlined" />
          <TextField label="Interest Rate" type="number" value={calc.interestRate} onChange={e => setCalc(c => ({ ...c, interestRate: e.target.value }))} variant="outlined" />
          <TextField label="Term (months)" type="number" value={calc.term} onChange={e => setCalc(c => ({ ...c, term: e.target.value }))} variant="outlined" />
          <Button variant="contained" onClick={handleCalc}>Calculate</Button>
        </Box>
        {calcResult && (
          <Box mt={2}>
            <Typography>Monthly Payment: ₹{calcResult.monthlyPayment}</Typography>
            <Typography>Total Payment: ₹{calcResult.totalPayment}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoanComparison; 