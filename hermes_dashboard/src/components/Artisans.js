// File: src/components/Artisans.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function Artisans() {
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/artisans')
      .then((response) => {
        setArtisans(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch artisans:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Artisans
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Working Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {artisans.map((artisan) => (
            <TableRow key={artisan.id}>
              <TableCell>{artisan.name}</TableCell>
              <TableCell>{artisan.totalWorkingHours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Artisans;