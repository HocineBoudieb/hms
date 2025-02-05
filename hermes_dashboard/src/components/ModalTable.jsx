import React from 'react';
import {Duration} from 'luxon'
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
                                <TableCell>Statut</TableCell>
                                <TableCell>Creation</TableCell>
                                <TableCell>Chevalet</TableCell>
                                <TableCell>Produit</TableCell>
                                <TableCell>Depuis</TableCell>
                                <TableCell>Priorité</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modalData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{new Date(row.startDate).toLocaleString()}</TableCell>
                                    <TableCell>{row.trolley || 'N/A'}</TableCell>
                                    <TableCell>{row.Product.material} {row.Product.color} {row.Product.option}</TableCell>
                                    <TableCell>
                                        {Duration.fromMillis(row.daysSinceCreation).shiftTo('hours').toFormat("h 'h,' m 'm'")}
                                    </TableCell>
                                    <TableCell> <span className={row.priority === 'medium' ? 'inline-flex items-center text-white font-bold px-2 py-1 rounded bg-orange-300' : (row.priority === 'urgent' ? 'inline-flex items-center text-white font-bold px-2 py-1 rounded bg-red-300' : 'inline-flex items-center text-white font-bold px-2 py-1 rounded bg-green-300') }>{row.priority}</span></TableCell>
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
