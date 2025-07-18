import React, { useState } from 'react';
import { Fab, Box, Paper, Typography, IconButton, TextField, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatSupportStub = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'support', text: 'Hi! How can we help you?' }
  ]);

  const handleSend = () => {
    if (msg.trim()) {
      setMessages([...messages, { from: 'user', text: msg }]);
      setMsg('');
    }
  };

  return (
    <>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }} onClick={() => setOpen(true)}>
        <ChatIcon />
      </Fab>
      {open && (
        <Paper sx={{ position: 'fixed', bottom: 100, right: 32, width: 320, p: 2, zIndex: 2100, bgcolor: 'background.paper' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Support Chat</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ maxHeight: 200, overflowY: 'auto', my: 1 }}>
            {messages.map((m, i) => (
              <Typography key={i} align={m.from === 'user' ? 'right' : 'left'} color={m.from === 'user' ? 'primary' : 'secondary'}>
                {m.text}
              </Typography>
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <TextField size="small" fullWidth value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message..." />
            <Button onClick={handleSend} variant="contained">Send</Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatSupportStub; 