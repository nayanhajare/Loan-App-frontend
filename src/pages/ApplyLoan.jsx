import React, { useState } from 'react';
import { Box, Typography, Button, Collapse, Switch, FormControlLabel } from '@mui/material';
import LoanApplicationStepper from '../components/LoanApplicationStepper';
import LoanDraftManager from '../components/User/LoanDraftManager';
import ChatSupportStub from '../components/User/ChatSupportStub';
import { useNavigate } from 'react-router-dom';

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draft, setDraft] = useState(null);

  const handleLoadDraft = (draftData) => {
    setDraft(draftData);
    // Optionally, pass draftData to LoanApplicationStepper via props/context
  };

  return (
    <Box maxWidth={600} mx="auto" mt={8} p={3} boxShadow={4} borderRadius={3} sx={{ bgcolor: 'background.paper' }}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <Typography variant="h5" mb={2} color="text.primary">Apply for a Loan</Typography>
      <LoanDraftManager onLoadDraft={handleLoadDraft} />
      {/* DocumentUploadMulti removed */}
      <FormControlLabel control={<Switch checked={showAdvanced} onChange={() => setShowAdvanced(v => !v)} />} label="Show Advanced Options" />
      <Collapse in={showAdvanced}>
        <Box mt={2} p={2} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography color="text.secondary">Advanced options go here (e.g., co-applicant, custom terms, etc.)</Typography>
        </Box>
      </Collapse>
      <LoanApplicationStepper draft={draft} />
      <ChatSupportStub />
    </Box>
  );
};

export default ApplyLoan; 