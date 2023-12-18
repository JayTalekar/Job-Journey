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
  Chip
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { addContact } from '../../firebase/FirestoreFunctions'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {addContact as addContactRedux} from '../../actions'

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
  
    const handleSubmit = async () => {
      try {
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
        console.error("Error adding contact: ", error);
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
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="company"
                label="Company Name"
                type="text"
                fullWidth
                variant="outlined"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="position"
                label="Position"
                type="text"
                fullWidth
                variant="outlined"
                value={position}
                onChange={e => setPosition(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPhoneNumber(e.target.value)}
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
                onChange={e => setLinkedIn(e.target.value)}
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
                onChange={e => setContactNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    )
}