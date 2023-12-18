import React, {useState} from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea
} from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { EditContactDialog } from "./EditContactDialog";

export const ContactCard = ({contactData}) => {

    const id = contactData.id? contactData.id: 0
    const name = contactData.name? contactData.name: ""
    const position = contactData.position? contactData.position: ""
    const company = contactData.company? contactData.company: ""

    const [openDialog, setOpenDialog] = useState(false);

    const handleAddContact = () => {
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
          <CardActionArea onClick={handleAddContact} >
            <CardContent>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <Box display={'flex'} justifyContent={'center'}>
                        <AccountCircleIcon color="secondary" sx={{width: '64px', height: '64px'}}/>
                    </Box>
                    <Typography variant='subtitle1' textAlign={'center'} fontWeight={'bold'} marginBottom={'2px'}>{name}</Typography>
                    <Typography variant='subtitle3' textAlign={'center'} marginBottom={'5px'}>{position}</Typography>
                    <Typography variant='subtitle3' textAlign={'center'} color={'primary'}>@{company}</Typography>
                </Box>
            </CardContent>
          </CardActionArea>
          {openDialog && <EditContactDialog data={contactData} onCloseCallback={onDialogClosed}/>}
        </Card>
      );
}