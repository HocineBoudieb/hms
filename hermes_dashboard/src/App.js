import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
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
    <ThemeProvider theme={theme}>
      {workshops.map((workshop) => ( 
        <h1>{workshop.name}</h1>
      ))}
    </ThemeProvider>
  );
}

export default App;
