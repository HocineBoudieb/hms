import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

const ModalTable = ({ isModalVisible, modalData, setIsModalVisible }) => {
    return (
        <div className={`fixed top-1 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${isModalVisible ? 'block' : 'hidden'} overflow-y-auto`}>
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto mt-20 relative">
                <Typography variant="h6" gutterBottom>
                    Orders Table
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>RFID</TableCell>
                                <TableCell>Last Alert</TableCell>
                                <TableCell>Last Support</TableCell>
                                <TableCell>Since</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modalData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{new Date(row.startDate).toLocaleString()}</TableCell>
                                    <TableCell>{row.RfidOrder?.rfid || 'N/A'}</TableCell>
                                    <TableCell>
                                        {row.Alert.length > 0 ? (
                                            <div key={row.Alert[0].id}>
                                                {`Type: ${row.Alert[0].type}, Start: ${new Date(row.Alert[0].startDate).toLocaleString()}, End: ${new Date(row.Alert[0].endDate).toLocaleString()}`}
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {row.Support.length > 0 ? (
                                            <div key={row.Support[0].id}>
                                                {`Type: ${row.Support[0].type}, Artisan ID: ${row.Support[0].artisanId}, Start: ${new Date(row.Support[0].startDate).toLocaleString()}, End: ${new Date(row.Support[0].endDate).toLocaleString()}`}
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {row.daysSinceCreation >= 1440
                                            ? `${Math.floor(row.daysSinceCreation / 1440)} days ${Math.floor((row.daysSinceCreation % 1440) / 60)} hours`
                                            : row.daysSinceCreation >= 60
                                            ? `${Math.floor(row.daysSinceCreation / 60)} hours`
                                            : `${row.daysSinceCreation} minutes`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button
                    className="bg-orange-500 text-white px-4 py-2 rounded absolute top-0 right-4 mt-2"
                    onClick={() => setIsModalVisible(false)}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalTable;
