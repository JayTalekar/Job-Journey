import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';

export const ErrorPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          We are having trouble loading this page. Please try again later.
        </Typography>
        <Button variant="outlined" color="primary" component={Link} to="/">
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
