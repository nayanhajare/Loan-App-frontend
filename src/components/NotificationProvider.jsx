import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [notifications, setNotifications] = useState([]); // persistent notifications

  const notify = (msg, sev = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
    // Add to persistent notifications
    setNotifications(prev => [
      { id: Date.now(), message: msg, severity: sev, timestamp: new Date() },
      ...prev.slice(0, 19) // keep max 20
    ]);
  };

  const addNotification = (msg, sev = 'info') => {
    setNotifications(prev => [
      { id: Date.now(), message: msg, severity: sev, timestamp: new Date() },
      ...prev.slice(0, 19)
    ]);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ notify, addNotification, notifications }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', bgcolor: 'background.paper', color: 'text.primary' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 