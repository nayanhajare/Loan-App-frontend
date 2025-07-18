import React, { useRef, useState } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';

const DocumentUploadMulti = ({ files, setFiles }) => {
  const fileInputRef = useRef();
  const [previews, setPreviews] = useState([]);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles(prev => [...prev, ...arr]);
    setPreviews(prev => [
      ...prev,
      ...arr.map(file => ({
        name: file.name,
        url: file.type.startsWith('image') ? URL.createObjectURL(file) : undefined,
        isPdf: file.type === 'application/pdf',
      }))
    ]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };
  const handleChange = (e) => handleFiles(e.target.files);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, textAlign: 'center', border: '2px dashed #aaa', bgcolor: 'background.default' }}
      onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current.click()}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleChange} accept="application/pdf,image/*" />
      <Typography>{previews.length ? `${previews.length} file(s) selected` : 'Drag & drop or click to select documents (PDF, Image)'}</Typography>
      <Stack direction="row" spacing={2} mt={2} justifyContent="center">
        {previews.map((file, idx) => file.isPdf ? (
          <Box key={idx}>
            <Typography variant="caption">{file.name}</Typography>
            <Typography variant="caption" color="text.secondary">[PDF]</Typography>
          </Box>
        ) : (
          <Box key={idx}>
            <img src={file.url} alt={file.name} width={60} style={{ borderRadius: 4 }} />
            <Typography variant="caption">{file.name}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default DocumentUploadMulti; 