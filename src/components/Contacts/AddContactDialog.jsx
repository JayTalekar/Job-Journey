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
import { addContact } from '../../firebase/FirestoreFunctions'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid, validate } from 'uuid';
import {addContact as addContactRedux} from '../../actions'
import {validateName, validateCompanyName, validateJobPositionTitle, validateEmail, validatePhoneNumber, validateURL, validateDescription} from '../../helpers'

export const AddContactDialog = ({onCloseCallback}) =>{

    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()
    const jobs = useSelector(state => state.jobs)

    const [open, setOpen] = useState(true);

    const [name, setName] = useState("")
    const [company, setCompany] = useState("") 
    const [position, setPosition] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [linkedIn, setLinkedIn] = useState("")
    const [contactNotes, setContactNotes] = useState("")
    const [selectedJobs, setSelectedJobs] = useState([])
  
    const handleClose = () => {
      setOpen(false);
      onCloseCallback()
    };

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)
  
    const handleSubmit = async () => {
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
            id: uuid(),
            name: name,
            company: company,
            position: position,
            email: email,
            phoneNumber: phoneNumber,
            linkedIn: linkedIn,
            contactNotes: contactNotes,
            linked_jobs: selectedJobs.map(job => job.id)
        }

        const result = await addContact(currentUser.uid, contact)
        if(result){
          dispatch(
            addContactRedux(contact)
          )
          handleClose();
        }else{
          // Handle contacts is not added to Cloud Storage
        }
      } catch (error) {
        setOpenSnackbar(true)
        setSeverity("error")
        setMessage(error.message)
        console.error("Error adding contact: ", error.message);
      }
    };

    return (
        <Dialog open={open} fullWidth>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>

        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={onCloseSnackbar}>
          <Alert severity={severity} sx={{ width: '100%' }} onClose={onCloseSnackbar}>
            {message}
          </Alert>
        </Snackbar>
      </Dialog>
    )
}