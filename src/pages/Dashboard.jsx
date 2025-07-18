import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Stack, Paper, TextField, Card, CardContent, CardActions, Grid, Container, Chip, Fade, Slide, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

function useCountUp(value, duration = 800) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    if (value === null || value === undefined) return;
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return Math.round(display * 100) / 100;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [calc, setCalc] = React.useState({ amount: '', interest: '', term: '' });
  const [calcResult, setCalcResult] = React.useState(null);
  const [loanSchemes, setLoanSchemes] = React.useState([]);
  const [repayments, setRepayments] = React.useState([]);
  const [loadingRepayments, setLoadingRepayments] = React.useState(false);

  React.useEffect(() => {
    api.get('/loan-products').then(res => setLoanSchemes(res.data)).catch(() => setLoanSchemes([]));
  }, []);

  React.useEffect(() => {
    if (user) {
      setLoadingRepayments(true);
      (async () => {
        try {
          const loanRes = user.role === 'admin'
            ? await api.get('/loans/all')
            : await api.get('/loans/my');
          let allRepayments = [];
          for (const loan of loanRes.data) {
            const res = await api.get(`/loans/${loan._id}/repayments`);
            allRepayments = allRepayments.concat(res.data.map(r => ({ ...r, loanAmount: loan.amount, loanId: loan._id })));
          }
          setRepayments(allRepayments);
        } catch {
          setRepayments([]);
        }
        setLoadingRepayments(false);
      })();
    }
  }, [user]);

  const handleCalc = () => {
    const P = Number(calc.amount);
    const r = Number(calc.interest) / 100 / 12;
    const n = Number(calc.term);
    const M = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    setCalcResult({ monthly: Number(M.toFixed(2)), total: Number((M * n).toFixed(2)) });
  };

  const handleApplyScheme = (scheme) => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to apply for a loan.' } });
    } else {
      navigate('/apply', { state: { scheme } });
    }
  };

  // Count-up animation for calculator results
  const monthlyAnim = useCountUp(calcResult?.monthly, 700);
  const totalAnim = useCountUp(calcResult?.total, 700);

  // Find most recent paid EMI and next due EMI
  const paidRepayments = repayments.filter(r => r.status === 'Paid').sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  const upcomingRepayments = repayments.filter(r => r.status === 'Upcoming').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const recentEMI = paidRepayments[0];
  const nextDue = upcomingRepayments[0];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {user && (
        <Slide in direction="down" timeout={600}>
          <Box
            textAlign="left"
            mb={{ xs: 3, md: 5 }}
            sx={{
              maxWidth: 480,
              mx: 'auto',
              background: user.role === 'admin' ? 'rgba(156, 39, 176, 0.06)' : 'rgba(33, 150, 243, 0.06)',
              borderLeft: `6px solid ${user.role === 'admin' ? theme => theme.palette.secondary.main : theme => theme.palette.primary.main}`,
              borderRadius: 2,
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              boxShadow: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box flex={1}>
              <Typography
                variant="h5"
                color={user.role === 'admin' ? 'secondary.main' : 'primary.main'}
                sx={{ fontWeight: 800, letterSpacing: 1, mb: 0.5 }}
              >
                Welcome, {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === 'admin' ? 'You have admin access.' : 'You are logged in as a user.'}
              </Typography>
            </Box>
            <Chip
              icon={user.role === 'admin' ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
              label={user.role === 'admin' ? 'Admin' : 'User'}
              color={user.role === 'admin' ? 'secondary' : 'primary'}
              size="small"
              sx={theme => ({
                fontWeight: 700,
                textTransform: 'capitalize',
                px: 1.5,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1.5px solid ${user.role === 'admin' ? theme.palette.secondary.main : theme.palette.primary.main}`
              })}
            />
          </Box>
        </Slide>
      )}
      {loanSchemes.length > 0 && (
        <Fade in timeout={700}>
          <Box mb={{ xs: 4, md: 7 }}>
            <Typography variant="h5" mb={{ xs: 2, md: 4 }} sx={{ fontWeight: 800, textAlign: 'center', letterSpacing: 1, color: 'primary.main', textShadow: '0 2px 8px rgba(25,118,210,0.08)', fontSize: { xs: 22, sm: 28, md: 34 } }}>
              Available Loan Schemes
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {loanSchemes.map((scheme, idx) => (
                <Grid item xs={12} sm={6} md={4} key={scheme._id} display="flex">
                  <Fade in timeout={600 + idx * 200}>
                    <Card
                      variant="outlined"
                      sx={{
                        bgcolor: 'background.paper',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
                        boxShadow: 4,
                        borderRadius: 4,
                        transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
                        '&:hover': {
                          transform: 'scale(1.045) translateY(-4px)',
                          boxShadow: 10,
                          borderColor: 'primary.main',
                          background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)',
                        },
                        minHeight: 270,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1.5px solid #90caf9',
                        width: '100%',
                        maxWidth: { xs: '100%', sm: 400 },
                        mx: 'auto',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }}>
                          {scheme.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={1} sx={{ minHeight: 48, fontSize: { xs: 14, sm: 16 } }}>{scheme.description}</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" mt={1} sx={{ fontSize: { xs: 13, sm: 15 } }}><b>Type:</b> {scheme.type}</Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}><b>Interest Rate:</b> {scheme.interestRate}%</Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}><b>Amount:</b> ₹{scheme.minAmount} - ₹{scheme.maxAmount}</Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}><b>Term:</b> {scheme.minTerm} - {scheme.maxTerm} months</Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', pb: 2 }}>
                        <button style={{
                          background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          boxShadow: '0 2px 12px rgba(25, 118, 210, 0.18)',
                          transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                          letterSpacing: 1,
                          outline: 'none',
                          width: '100%',
                          maxWidth: 160,
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => handleApplyScheme(scheme)}
                        >Apply</button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}
      {user && (
        <Slide in direction="up" timeout={800}>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default', borderRadius: 4, boxShadow: 2, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10 }, border: '1.5px solid #90caf9', minHeight: 320 }}>
                <Typography variant="h5" mb={2} sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1, fontSize: { xs: 18, sm: 22 } }}>Loan Calculator</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                  <TextField label="Amount" type="number" value={calc.amount} onChange={e => setCalc(c => ({ ...c, amount: e.target.value }))} variant="outlined" size="small" sx={{ flex: 1 }} />
                  <TextField label="Interest Rate" type="number" value={calc.interest} onChange={e => setCalc(c => ({ ...c, interest: e.target.value }))} variant="outlined" size="small" sx={{ flex: 1 }} />
                  <TextField label="Term (months)" type="number" value={calc.term} onChange={e => setCalc(c => ({ ...c, term: e.target.value }))} variant="outlined" size="small" sx={{ flex: 1 }} />
                  <button style={{
                    background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(25, 118, 210, 0.18)',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                    letterSpacing: 1,
                    outline: 'none',
                    width: '100%',
                    maxWidth: 160,
                    marginTop: 8,
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={handleCalc}
                  >Calculate</button>
        </Stack>
        {calcResult && (
                  <Box mt={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: 15, sm: 17 } }}>Monthly Payment:</Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 900, mb: 1, letterSpacing: 1, fontSize: { xs: 22, sm: 30 } }}>
                      ₹{monthlyAnim}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: 15, sm: 17 } }}>Total Payment:</Typography>
                    <Typography variant="h5" color="secondary" sx={{ fontWeight: 800, letterSpacing: 1, fontSize: { xs: 18, sm: 24 } }}>
                      ₹{totalAnim}
                    </Typography>
          </Box>
        )}
      </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default', borderRadius: 4, boxShadow: 2, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10 }, border: '1.5px solid #90caf9', minHeight: 320 }}>
                <Typography variant="h5" mb={2} sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1, fontSize: { xs: 18, sm: 22 } }}>Payment Reminders</Typography>
                {loadingRepayments ? (
                  <Typography color="text.secondary">Loading...</Typography>
                ) : repayments.length === 0 ? (
                  <Typography color="text.secondary">No repayments found.</Typography>
                ) : (
                  <Box>
                    <Box mb={2}>
                      <Typography variant="subtitle1" color="primary" fontWeight={700} mb={1}>Most Recent EMI Paid</Typography>
                      {recentEMI ? (
                        <>
                          <Typography>Amount: <b>₹{recentEMI.amount}</b></Typography>
                          <Typography>Paid On: <b>{recentEMI.paidAt ? new Date(recentEMI.paidAt).toLocaleDateString() : '-'}</b></Typography>
                          <Typography>Status: <b>Paid</b></Typography>
                        </>
                      ) : <Typography color="text.secondary">No EMI paid yet.</Typography>}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="secondary" fontWeight={700} mb={1}>Next Payment Due</Typography>
                      {nextDue ? (
                        <>
                          <Typography>Amount: <b>₹{nextDue.amount}</b></Typography>
                          <Typography>Due Date: <b>{new Date(nextDue.dueDate).toLocaleDateString()}</b></Typography>
                          <Typography>Status: <b>Upcoming</b></Typography>
                        </>
                      ) : <Typography color="text.secondary">No upcoming payment due.</Typography>}
                    </Box>
                  </Box>
                )}
      </Paper>
            </Grid>
          </Grid>
        </Slide>
      )}
    </Container>
  );
};

export default Dashboard; 