import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, TextField, Fade, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import api from '../services/api';

const steps = ['Personal Info', 'Financial Details', 'Document Upload', 'Review & Submit'];
const FORM_KEY = 'loanAppFormData';

const LoanApplicationStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  const { control, handleSubmit, getValues, setValue, trigger, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      dob: '',
      address: '',
      income: '',
      amount: ''
    }
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => setValue(key, data[key]));
    }
  }, [setValue]);

  // Save data on change
  useEffect(() => {
    const sub = () => {
      const data = getValues();
      localStorage.setItem(FORM_KEY, JSON.stringify(data));
    };
    window.addEventListener('beforeunload', sub);
    return () => window.removeEventListener('beforeunload', sub);
  }, [getValues]);

  // Save on every field change
  const handleFieldChange = () => {
    const data = getValues();
    localStorage.setItem(FORM_KEY, JSON.stringify(data));
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setFileName(droppedFile.name);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Apply for loan
      const loanRes = await api.post('/loans/apply', { amount: data.amount });
      const loanId = loanRes.data._id;
      // 2. Upload document (simulate file upload)
      let fileUrl = 'https://dummyurl.com/doc.pdf';
      if (file) {
        // In production, upload file to server/cloud and get URL
        fileUrl = URL.createObjectURL(file); // For demo only
      }
      await api.post('/documents/upload', {
        loan: loanId,
        type: 'ID Proof',
        fileUrl
      });
      setSuccess(true);
      localStorage.removeItem(FORM_KEY);
    } catch (err) {
      alert('Application failed');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fade in={activeStep === 0} unmountOnExit>
          <Box display={activeStep === 0 ? 'block' : 'none'}>
            <Controller name="fullName" control={control} rules={{ required: 'Full Name required' }}
              render={({ field }) => <TextField {...field} label="Full Name" fullWidth margin="normal" error={!!errors.fullName} helperText={errors.fullName?.message} onBlur={handleFieldChange} variant="outlined" />} />
            <Controller name="dob" control={control} rules={{ required: 'Date of Birth required' }}
              render={({ field }) => <TextField {...field} label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" error={!!errors.dob} helperText={errors.dob?.message} onBlur={handleFieldChange} variant="outlined" />} />
            <Controller name="address" control={control} rules={{ required: 'Address required' }}
              render={({ field }) => <TextField {...field} label="Address" fullWidth margin="normal" error={!!errors.address} helperText={errors.address?.message} onBlur={handleFieldChange} variant="outlined" />} />
          </Box>
        </Fade>
        <Fade in={activeStep === 1} unmountOnExit>
          <Box display={activeStep === 1 ? 'block' : 'none'}>
            <Controller name="income" control={control} rules={{ required: 'Income required' }}
              render={({ field }) => <TextField {...field} label="Annual Income" type="number" fullWidth margin="normal" error={!!errors.income} helperText={errors.income?.message} onBlur={handleFieldChange} variant="outlined" />} />
            <Controller name="amount" control={control} rules={{ required: 'Loan Amount required' }}
              render={({ field }) => <TextField {...field} label="Loan Amount" type="number" fullWidth margin="normal" error={!!errors.amount} helperText={errors.amount?.message} onBlur={handleFieldChange} variant="outlined" />} />
          </Box>
        </Fade>
        <Fade in={activeStep === 2} unmountOnExit>
          <Box display={activeStep === 2 ? 'block' : 'none'}>
            <Paper
              variant="outlined"
              sx={{ p: 2, mb: 2, textAlign: 'center', border: '2px dashed #aaa', bgcolor: 'background.default' }}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
              <Typography>{fileName ? `Selected: ${fileName}` : 'Drag & drop or click to select a document (PDF, Image)'}</Typography>
            </Paper>
          </Box>
        </Fade>
        <Fade in={activeStep === 3} unmountOnExit>
          <Box display={activeStep === 3 ? 'block' : 'none'}>
            <Typography variant="h6" mb={2}>Review & Submit</Typography>
            <pre>{JSON.stringify(getValues(), null, 2)}</pre>
            <Typography>Document: {fileName || 'No file selected'}</Typography>
          </Box>
        </Fade>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          {activeStep < steps.length - 1 && <Button onClick={handleNext}>Next</Button>}
          {activeStep === steps.length - 1 && <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>}
        </Box>
        {success && <Typography color="success.main" mt={2}>Loan Application Submitted!</Typography>}
      </form>
    </Box>
  );
};

export default LoanApplicationStepper; 