// File: src/components/Workshops.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function Workshops() {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/workshops')
      .then((response) => {
        console.log(response.data);
        setWorkshops(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch workshops:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Workshops
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>En Cours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workshops.map((workshop) => (
            <TableRow key={workshop.id}>
              <TableCell>{workshop.name}</TableCell>
              <TableCell>{workshop.EnCours.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Workshops;
