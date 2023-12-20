import { useState } from 'react';
import {
  Box, 
  Typography,
  Button,
  Divider
} from '@mui/material'; 
import { DocumentsGrid } from './Documents/DocumentsGrid';
import { AddDocumentDialog } from './Documents/AddDocumentDialog'
import AddIcon from '@mui/icons-material/Add';

export const DocumentsPage = ({jobId}) => {

  const [openDialog, setOpenDialog] = useState(false);

  const handleAddDocument = () => {
      setOpenDialog(true);
  };

  const onDialogClosed = () =>{
      setOpenDialog(false)
  }
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mx={'10px'} marginBottom={'10px'}>
        <Typography variant='h5'>
          Your Documents
        </Typography>

        <Button startIcon={<AddIcon/>} variant="contained" color="secondary" size="small" onClick={handleAddDocument}>
          Add Documents
        </Button>
      </Box>

      <Divider/>

      <DocumentsGrid jobId={jobId}/>

      {openDialog && <AddDocumentDialog jobId={jobId} onCloseCallback={onDialogClosed}/>}
    </Box>
  );
};
