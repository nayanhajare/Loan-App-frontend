import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Paper, Typography } from '@mui/material';

const stubHistory = [
  { status: 'Submitted', date: '2024-06-01' },
  { status: 'Under Review', date: '2024-06-02' },
  { status: 'Approved', date: '2024-06-03' },
];

const LoanTimeline = ({ history = stubHistory }) => (
  <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h6" mb={2}>Application History</Typography>
    <Timeline position="right">
      {history.map((item, idx) => (
        <TimelineItem key={idx}>
          <TimelineSeparator>
            <TimelineDot color={item.status === 'Approved' ? 'success' : item.status === 'Denied' ? 'error' : 'info'} />
            {idx < history.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography>{item.status}</Typography>
            <Typography variant="caption" color="text.secondary">{item.date}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </Paper>
);

export default LoanTimeline; 