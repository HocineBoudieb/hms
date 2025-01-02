// File: src/components/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch orders:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Days Since Creation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.daysSinceCreation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Orders;
