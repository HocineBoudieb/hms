import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FFA500',
        },
        secondary: {
            main: '#FFA500',
        },
    },
});

const Tables = () => {
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTable, setCurrentTable] = useState('orders'); // Default table

  const tables = useMemo(() => ['orders', 'supports', 'rfids', 'alerts'],[]); // List of tables to display

  useEffect(() => {
    const fetchTableData = async (table) => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint to fetch data for a specific table
        const response = await axios.get(process.env.API_URL+`/${table}`);
        setTableData((prevData) => ({ ...prevData, [table]: response.data }));
      } catch (error) {
        console.error(`Error fetching data for table ${table}:`, error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data for all tables
    tables.forEach((table) => {
      if (!tableData[table]) fetchTableData(table);
    });
  }, [tableData, tables]);

  const handleTabChange = (event, newValue) => {
    setCurrentTable(newValue);
  };

  const columns = tableData[currentTable]?.length
    ? Object.keys(tableData[currentTable][0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        sortable: true,
      }))
    : [];

  return ( 
    <ThemeProvider theme={theme}>
        <div className='flex flex-col items-center justify-center py-2 ml-64 mt-10'>
            <div className='h-16 w-full px-6'>
                
            </div>
            <Box sx={{ padding: 4, maxWidth: '1200px', backgroundColor: 'white' }}>
            <Tabs value={currentTable} onChange={handleTabChange} sx={{ marginBottom: 2 }} indicatorColor='secondary'>
                {tables.map((table) => (
                <Tab key={table} label={table} value={table} />
                ))}
            </Tabs>

            <Box sx={{ height: 600, width: '100%' }}>
                {loading ? (
                <Typography variant="body1">Loading data...</Typography>
                ) : (
                <DataGrid
                    rows={tableData[currentTable]?.map((row, index) => ({ id: index, ...row })) || []}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                    autoPageSize
                    pagination
                />
                )}
            </Box>
            </Box>
        </div>
    </ThemeProvider>
  );
};

export default Tables;