import { useState } from 'react';
import {
  Box, 
  Typography,
  Button,
  Divider
} from '@mui/material'; 
import { ContactsGrid } from './Contacts/ContactsGrid';
import { AddContactDialog } from './Contacts/AddContactDialog';
import AddIcon from '@mui/icons-material/Add';

export const ContactsPage = ({jobId}) => {

  const [openDialog, setOpenDialog] = useState(false);

  const handleAddContact = () => {
      setOpenDialog(true);
  };

  const onDialogClosed = () =>{
      setOpenDialog(false)
  }
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mx={'10px'} marginBottom={'10px'}>
        <Typography variant='h5'>
          Your Contacts
        </Typography>

        <Button startIcon={<AddIcon/>} variant="contained" color="secondary" size="small" onClick={handleAddContact}>
          Add contacts
        </Button>
      </Box>

      <Divider/>

      <ContactsGrid jobId={jobId}/>

      {openDialog && <AddContactDialog jobId={jobId} onCloseCallback={onDialogClosed}/>}
    </Box>
  );
};
