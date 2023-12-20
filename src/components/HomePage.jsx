import React from 'react';
import { Typography, Button, Paper, Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import Image from '../assets/HomePage.png';
import { NavLink } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  textAlign: 'center',
}));

export const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" p={4}>
        <Box flex={1} p={2}>
          <Typography variant="h3" component="h1" gutterBottom>
            <b>LAUNCH YOUR CAREER QUEST WITH CLARITY</b>
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Plan, Track, Achieve!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your career journey, mapped and mastered. With our intuitive tracking, turn every application into a stepping stone towards success.
          </Typography>
            <br />
          <Button variant="contained" color="primary" size="large" component={NavLink} to="/signup">
            
            Get Started
          </Button>
        </Box>
        <Box flex={1} p={2}>
            <img src={Image} alt="Application Preview" style={{ width: '100%', height: 'auto', border: '2px solid' }} />
          
        </Box>
      </Box>
    </Container>
  );
};
