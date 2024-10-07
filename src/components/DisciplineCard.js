/* DisciplineCard.js */

import React from 'react';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const DisciplineCard = ({ nome, ementa, onClick }) => {
  return (
    <Card sx={{ width: '100%', minHeight: '200px' }}> {/* Define a largura e altura mínima */}
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6" component="div">
            {nome}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {ementa || 'Sem descrição'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DisciplineCard;
