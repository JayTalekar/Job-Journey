import React, { useState, useContext, useEffect } from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocumentWithMetadata } from '../../firebase/StorageFunctions';
import { v4 as uuid } from 'uuid';
import { doc_type } from '../../constants';
import { addDoc } from '../../actions'
import {validateFileName, validateDescription} from '../../helpers'

export const AddDocumentDialog = ({jobId, onCloseCallback}) =>{

    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()
    const jobs = useSelector(state => state.jobs)

    const [open, setOpen] = useState(true);

    let id = null
    const [fileName, setFileName] = useState("") 
    const [documentType, setDocumentType] = useState(doc_type[0])
    const [desc, setDesc] = useState("")
    const [selectedJobs, setSelectedJobs] = useState([])

    const [file, setFile] = useState(null)
    async function handleFileUpload(event){
      setFile(await event.target.files[0])
    }

    useEffect(() => {
      if(jobId){
        const selectedJob = jobs.find(j => j.id == jobId)

        if(selectedJob){
          setSelectedJobs([selectedJob])
        }
      }
    }, [jobId])

    const handleClose = () => {
      setOpen(false);
      onCloseCallback()
    };

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)

    function uploadSuccessCallback(downloadURL){
      const docData = {
        id: id,
        fileName: fileName,
        documentType: documentType,
        desc: desc,
        linked_jobs: JSON.stringify(selectedJobs.map(job => job.id)),
        downloadURL: downloadURL
      }

      dispatch(
        addDoc(docData)
      )

      handleClose()
    }

    function uploadErrorCallback(error){
      setOpenSnackbar(true)
      setSeverity("error")
      setMessage(error.message)
    }
  
    const handleSubmit = async () => {
      try {
        if(fileName.length == 0) throw new Error("File Name is required")
        validateFileName(fileName)
        if(desc.length != 0) validateDescription(desc)

        if (file == null) throw new Error("No file to upload!")
        id = uuid()
        const docMetaData = {
            customMetadata: {
                id: id,
                fileName: fileName,
                documentType: documentType,
                desc: desc,
                linked_jobs: JSON.stringify(selectedJobs.map(job => job.id))  
            }
        }

        uploadDocumentWithMetadata(currentUser.uid, file, docMetaData, uploadSuccessCallback, uploadErrorCallback)

      } catch (error) {
        setOpenSnackbar(true)
        setSeverity("error")
        setMessage(error.message)
        console.error("Error Uploading Document: ", error.message);
      }
    };

    return (
        <Dialog open={open} fullWidth>
        <DialogTitle>Add Document</DialogTitle>
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
            {!file &&
              <Button type='file' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                
                Upload file <input accept=".pdf" type="file" hidden onChange={e => handleFileUpload(e)}/>
              </Button>
            }
            {file &&
                <Typography variant='subtitle1' fontWeight={'bold'}>
                  Selected File: 
                  <Button type='file' component="label" variant="text">
                    {file.name} <input type="file" hidden onChange={e => handleFileUpload(e)}/>
                  </Button>
                </Typography>
            }
            
            <Typography variant='subtitle2' marginTop={'15px'}>We support only PDF for now (up to 5MB)</Typography>
          </Box>
          

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