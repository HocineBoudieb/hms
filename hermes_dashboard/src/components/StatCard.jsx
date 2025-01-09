import React from 'react';
import { Card, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, percentageChange, isIncrease, Icon, iconColor = '#7D0000' }) => {
    return (
        <Card elevation={0} sx={{ borderRadius: 2, padding: 2, display: 'flex', flexDirection: 'column', gap: 1, width: '23%' , height: 160 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary">
                    {title}
                </Typography>
                <Box sx={{ backgroundColor: '#FAD2D2', borderRadius: '40%', padding: 1 }}>
                    {Icon && <Icon sx={{ color: iconColor }} />}
                </Box>
            </Box>
            <Typography variant="h4" fontWeight="bold">
                {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: isIncrease ? 'green' : 'red', fontWeight: 'bold' }}>
                    {isIncrease ? '▲' : '▼'} {percentageChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Up from yesterday
                </Typography>
            </Box>
        </Card>
    );
};

export default StatCard;
