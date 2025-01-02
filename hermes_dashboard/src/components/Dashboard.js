
// File: src/components/Dashboard.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Workshop Manager Dashboard
      </Typography>
      <Typography>
        <Link to="/artisans">View Artisans</Link>
      </Typography>
      <Typography>
        <Link to="/workshops">View Workshops</Link>
      </Typography>
      <Typography>
        <Link to="/orders">View Orders</Link>
      </Typography>
    </Container>
  );
}

export default Dashboard;