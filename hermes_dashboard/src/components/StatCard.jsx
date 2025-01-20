import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import tinycolor from 'tinycolor2';

const StatCard = ({ title, value, percentageChange, isIncrease, Icon, iconColor = '#7D0000',unit='h', color }) => {
    return (
        <Card elevation={0} sx={{ borderRadius: 2, padding: 1.5, display: 'flex', flexDirection: 'column', gap: 1, width: '23%' , height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                <Box sx={{ backgroundColor: tinycolor(iconColor).lighten(25).toString(), borderRadius: '40%', padding: 1 }}>
                    {Icon && <Icon sx={{ color: iconColor }} />}
                </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold">
                {value} {unit}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: percentageChange ? color : '#ffa500', fontWeight: 'bold' }}>
                    {percentageChange === 0 ? '➤' : isIncrease ? '▲' : '▼'} {percentageChange !== 0 ? percentageChange + '%' : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    from yesterday
                </Typography>
            </Box>
        </Card>
    );
};

export default StatCard;
