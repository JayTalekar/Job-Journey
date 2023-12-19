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
  Alert,
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocMetadata, deleteDocument } from '../../firebase/StorageFunctions';
import { doc_type } from '../../constants';
import { editDoc, deleteDoc } from '../../actions'
import {validateFileName, validateDescription} from '../../helpers'

export const EditDocumentDialog = ({docData, onCloseCallback}) =>{

    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()
    const jobs = useSelector(state => state.jobs)

    const [open, setOpen] = useState(true);

    const id = docData.id
    const [fileName, setFileName] = useState(docData.fileName? docData.fileName : "") 
    const [documentType, setDocumentType] = useState(docData.documentType? docData.documentType : doc_type[0])
    const [desc, setDesc] = useState(docData.desc? docData.desc : "")
    const [selectedJobs, setSelectedJobs] = useState(
        docData.linked_jobs? jobs.filter(job => JSON.parse(docData.linked_jobs).includes(job.id))
        : [])
    const downloadURL = docData.downloadURL

    const handleClose = () => {
      setOpen(false);
      onCloseCallback()
    };

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)

    function updateSuccessCallback(){
      const docData = {
        id: id,
        fileName: fileName,
        documentType: documentType,
        desc: desc,
        linked_jobs: JSON.stringify(selectedJobs.map(job => job.id)),
        downloadURL: downloadURL
      }

      dispatch(
        editDoc(docData)
      )

      handleClose()
    }

    function deleteSuccessCallback(){
        dispatch(
            deleteDoc(id)
        )
        handleClose()
    }

    function errorCallback(error){
      setOpenSnackbar(true)
      setSeverity("error")
      setMessage(error.message)
    }
  
    const handleEdit = async () => {
      try {
        if(fileName.length == 0) throw new Error("File Name is required")
        validateFileName(fileName)
        if(desc.length != 0) validateDescription(desc)

        const docMetadata = {
            customMetadata: {
                fileName: fileName,
                documentType: documentType,
                desc: desc,
                linked_jobs: JSON.stringify(selectedJobs.map(job => job.id))
            }
        }

        updateDocMetadata(currentUser.uid, id, docMetadata, updateSuccessCallback, errorCallback)

      } catch (error) {
        setOpenSnackbar(true)
        setSeverity("error")
        setMessage(error.message)
        console.error("Error Editing Document: ", error.message);
      }
    };

    const handleDelete = async() => {
        try{
            deleteDocument(currentUser.uid, id, deleteSuccessCallback, errorCallback)
        }catch(error){
            setOpenSnackbar(true)
            setSeverity("error")
            setMessage(error.message)
            console.error("Error Deleting Document: ", error.message);
        }
    }

    const prevFileName = docData.fileName
    function onClickLink(){
        window.open(downloadURL)
    }

    return (
        <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogTitle>Edit Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                margin="dense"
                name="fileName"
                label="File Name"
                type="text"
                fullWidth
                variant="outlined"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Document Type</InputLabel>
              <Select
                required
                variant='outlined'
                fullWidth

                name='documentType'
                value={documentType}
                onChange={e => setDocumentType(e.target.value)}
              >
                {doc_type.map(type => (
                    <MenuItem value={type}>
                        <Typography variant='subtitle1' fontWeight='bold'>{type}</Typography>
                    </MenuItem>  
                ))}
              </Select>
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
                name="desc"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box display={'flex'} flexDirection={'column'} alignContent={'center'} flexWrap={'wrap'} marginTop={'10px'}>
            {downloadURL &&
                <Typography variant='subtitle1' fontWeight={'bold'}>
                  Your Document:
                  <Button startIcon={<AttachmentIcon />} variant="text" onClick={onClickLink}>
                    {prevFileName}.pdf
                  </Button>
                </Typography>
            }
          </Box>
          

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant='contained' color='error'>Delete</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">Save</Button>
        </DialogActions>

        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={onCloseSnackbar}>
          <Alert severity={severity} sx={{ width: '100%' }} onClose={onCloseSnackbar}>
            {message}
          </Alert>
        </Snackbar>
      </Dialog>
    )
}