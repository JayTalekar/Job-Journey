import { 
  Box, 
  Typography,
  Button,
  Divider
 } from '@mui/material';
import React from 'react';
import { ContactsGrid } from './Contacts/ContactsGrid';

export const ContactsPage = () => {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mx={'10px'} marginBottom={'10px'}>
        <Typography variant='h5'>
          Your Contacts
        </Typography>

        <Button variant="contained" color="secondary" size="small">
          Add contacts
        </Button>
      </Box>

      <Divider/>

      <ContactsGrid/>

    </Box>
  );
};