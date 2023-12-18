import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../main'; 

export const ContactsPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    position: '',
    email: '',
    phoneNumber: '',
    linkedIn: '',
    contactNotes: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      //uuid = cuurentuser.userid (authcontext)

      await addDoc(collection(db, "contacts"), formData);
      handleClose();
      setFormData({
        name: '',
        companyName: '',
        position: '',
        email: '',
        phoneNumber: '',
        linkedIn: '',
        contactNotes: ''
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Contact
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
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
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="companyName"
                label="Company Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.companyName}
                onChange={handleChange}
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
                value={formData.position}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="linkedIn"
                label="LinkedIn"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.linkedIn}
                onChange={handleChange}
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
                value={formData.contactNotes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save & Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
