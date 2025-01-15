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
        <div className={`fixed top-1 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${isModalVisible ? 'block' : 'hidden'}`}>
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
                                <TableCell>End Date</TableCell>
                                <TableCell>RFID</TableCell>
                                <TableCell>Alerts</TableCell>
                                <TableCell>Supports</TableCell>
                                <TableCell>Since</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modalData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{new Date(row.startDate).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(row.endDate).toLocaleString()}</TableCell>
                                    <TableCell>{row.RfidOrder?.rfid || 'N/A'}</TableCell>
                                    <TableCell>
                                        {row.Alert.map((alert) => (
                                            <div key={alert.id}>
                                                {`Type: ${alert.type}, Start: ${new Date(alert.startDate).toLocaleString()}, End: ${new Date(alert.endDate).toLocaleString()}`}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {row.Support.map((support) => (
                                            <div key={support.id}>
                                                {`Type: ${support.type}, Artisan ID: ${support.artisanId}, Start: ${new Date(support.startDate).toLocaleString()}, End: ${new Date(support.endDate).toLocaleString()}`}
                                            </div>
                                        ))}
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
