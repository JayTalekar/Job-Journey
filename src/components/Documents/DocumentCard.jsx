import React, {useState} from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Chip
} from "@mui/material"
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { EditDocumentDialog } from "./EditDocumentDialog";

export const DocumentCard = ({docData}) => {

    const id = docData.id? docData.id: 0
    const fileName = docData.fileName? docData.fileName: ""
    const documentType = docData.documentType? docData.documentType: ""

    const [openDialog, setOpenDialog] = useState(false);

    const handleEditDoc = () => {
      setOpenDialog(true);
    };

    const onDialogClosed = () =>{
      setOpenDialog(false)
    }


    return (
        <Card
          key={id}
          display={'inline-block'}
          sx={{marginBottom: '10px', marginX: '5px'}}>
          <CardActionArea onClick={handleEditDoc}>
            <CardContent>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Box display={'flex'} justifyContent={'center'}>
                        <InsertDriveFileIcon color="secondary" sx={{width: '64px', height: '64px'}}/>
                    </Box>
                    <Typography variant='subtitle1' textAlign={'center'} fontWeight={'bold'} marginBottom={'2px'}>{fileName}</Typography>
                    <Chip label={documentType}/>
                </Box>
            </CardContent>
          </CardActionArea>
          {openDialog && <EditDocumentDialog docData={docData} onCloseCallback={onDialogClosed}/>}
        </Card>
      );
}