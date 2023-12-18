import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  Typography,
  MenuItem,
  InputLabel,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { editContact, deleteContact } from '../../firebase/FirestoreFunctions'
import { useDispatch, useSelector } from 'react-redux';
import {editContact as editContactRedux, deleteContact as deleteContactRedux} from '../../actions'
import {validateName, validateCompanyName, validateJobPositionTitle, validateEmail, validatePhoneNumber, validateURL, validateDescription} from '../../helpers'

export const EditContactDialog = ({data, onCloseCallback}) =>{

    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()
    const jobs = useSelector(state => state.jobs)

    const [open, setOpen] = useState(true);

    const id = data.id
    const [name, setName] = useState(data.name ? data.name :"")
    const [company, setCompany] = useState(data.company ? data.company :"") 
    const [position, setPosition] = useState(data.position ? data.position :"")
    const [email, setEmail] = useState(data.email ? data.email :"")
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber ? data.phoneNumber :"")
    const [linkedIn, setLinkedIn] = useState(data.linkedIn ? data.linkedIn :"")
    const [contactNotes, setContactNotes] = useState(data.contactNotes ? data.contactNotes :"")
    const [selectedJobs, setSelectedJobs] = useState(
        data.linked_jobs ? jobs.filter(j => data.linked_jobs.includes(j.id)) :[]
    )
    
  
    const handleClose = () => {
      setOpen(false);
      onCloseCallback()
    };
  
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)

    const handleSave = async () => {
      try {
        if(name.length == 0) throw new Error("Name is Required")
        validateName(name)
        if(company.length == 0) throw new Error("Company Name is Required")
        validateCompanyName(company)
        if(position.length == 0) throw new Error("Position is Required")
        validateJobPositionTitle(position)
        if(email.length == 0) throw new Error("Email is Required")
        validateEmail(email)
        if(phoneNumber) validatePhoneNumber(phoneNumber)
        if(linkedIn) validateURL(linkedIn)
        if(contactNotes) validateDescription(contactNotes)

        const contact = {
            id: id,
            name: name,
            company: company,
            position: position,
            email: email,
            phoneNumber: phoneNumber,
            linkedIn: linkedIn,
            contactNotes: contactNotes,
            linked_jobs: selectedJobs.map(job => job.id)
        }

        const result = await editContact(currentUser.uid, contact)
        if(result){
          dispatch(
            editContactRedux(contact)
          )
          handleClose();
        }else{
          // Handle contacts is not edited to Cloud Storage
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSeverity("error")
        setMessage(error.message)
        console.error("Error editing contact: ", error);
      }
    };

    const handleDelete = async () => {
        try{
            const result = await deleteContact(currentUser.uid, id)
            if(result){
                dispatch(
                    deleteContactRedux(id)
                )

                handleClose()
            }else{
                // Handle contact is not deleted to Cloud Storage
            }
        }catch(error){
            console.log("Error deleting contact: ", error)
        }
    }

    return (
        <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={e => setName(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                name="company"
                label="Company Name"
                type="text"
                fullWidth
                variant="outlined"
                value={company}
                onChange={e => setCompany(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                name="position"
                label="Position"
                type="text"
                fullWidth
                variant="outlined"
                value={position}
                onChange={e => setPosition(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Phone number"
                type="tel"
                fullWidth
                variant="outlined"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Link Jobs</InputLabel>
                <Select
                    fullWidth
                    multiple
                    variant="outlined"

                    name="selectedJobs"
                    value={selectedJobs}

                    onChange={e => setSelectedJobs([...e.target.value])}

                    renderValue={jobs => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {jobs.map((job) => (
                                <Chip key={job.id} label={job.position + " @" + job.company} />
                            ))}
                        </Box>
                    )}
                >
                    {jobs.map(job => (
                        <MenuItem value={job}>
                            <Box>
                                <Typography variant='subtitle2' fontWeight='bold'>{job.company}</Typography>  
                                <Typography variant='subtitle1'>{job.position}</Typography>
                            </Box>
                        </MenuItem>    
                    ))}
              </Select>

            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="linkedIn"
                label="LinkedIn"
                type="text"
                fullWidth
                variant="outlined"
                value={linkedIn}
                onChange={e => setLinkedIn(e.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="contactNotes"
                label="Contact Notes"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={contactNotes}
                onChange={e => setContactNotes(e.target.value.trim())}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant='contained' color='error'>Delete</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>

        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={onCloseSnackbar}>
          <Alert severity={severity} sx={{ width: '100%' }} onClose={onCloseSnackbar}>
            {message}
          </Alert>
        </Snackbar>
      </Dialog>
    )
}