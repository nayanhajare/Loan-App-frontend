import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Stack } from '@mui/material';

const DRAFTS_KEY = 'loanAppDrafts';

const LoanDraftManager = ({ onLoadDraft }) => {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFTS_KEY);
    setDrafts(saved ? JSON.parse(saved) : []);
  }, []);

  const handleLoad = (draft) => onLoadDraft(draft);
  const handleDelete = (idx) => {
    const newDrafts = drafts.filter((_, i) => i !== idx);
    setDrafts(newDrafts);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
  };

  if (!drafts.length) return null;

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" mb={2}>Saved Drafts</Typography>
      <Stack spacing={1}>
        {drafts.map((draft, idx) => (
          <Stack key={idx} direction="row" spacing={2} alignItems="center">
            <Typography>Draft {idx + 1} - Amount: ₹{draft.amount || 'N/A'}</Typography>
            <Button size="small" variant="outlined" onClick={() => handleLoad(draft)}>Load</Button>
            <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default LoanDraftManager; 