import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { editJob, deleteJob } from "../../actions";
import { categories, job_type } from "../../constants";
import {
    Box,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    Button,
    Typography,
    MenuItem,
    Snackbar,
    Alert,
    Grid,
    InputAdornment
} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BusinessIcon from '@mui/icons-material/Business';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { updateJob, deleteJob as removeJob } from "../../firebase/FirestoreFunctions";
import { AuthContext } from "../../context/AuthContext";
import { validateCompanyName, validateJobPositionTitle, validateSalary, validateLocationName, validateURL, validateDescription } from '../../helpers'

const EditJobDialog = ({jobData, onCloseCallback}) => {
    const {currentUser} = useContext(AuthContext)

    const dispatch = useDispatch();
    
    const id = jobData.id
    const [company, setCompany] = useState(jobData.company? jobData.company : "");
    const [position, setPosition] = useState(jobData.category? jobData.position : "");
    const [salary, setSalary] = useState(jobData.salary? jobData.salary : "");
    const prevCategory = jobData.category
    const [category, setCategory] = useState(jobData.category? jobData.category : categories[0]);
    const [jobType, setJobType] = useState(jobData.jobType? jobData.jobType : job_type[0])
    const [location, setLocation] = useState(jobData.location? jobData.location : "")
    const [url, setURL] = useState(jobData.url? jobData.url : "")
    const [desc, setDesc] = useState(jobData.desc? jobData.desc: "")
    const [open, setOpen] = useState(true);

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)

    const handleClose = () => {
        setOpen(false);
        console.log(jobData)
        onCloseCallback()
    };

    const handleSave = async () => {
        try{
            if(company.length == 0) throw new Error("Company Name is Required")
            validateCompanyName(company)
            if(position.length == 0) throw new Error("Position is Required")
            validateJobPositionTitle(position)
            if(salary) validateSalary(parseInt(salary))
            if(location) validateLocationName(location)
            if(url) validateURL(url)
            if(desc) validateDescription(desc)

            jobData.company = company
            jobData.position = position
            jobData.salary = salary
            jobData.category = category
            jobData.jobType = jobType
            jobData.location = location
            jobData.url = url
            jobData.desc = desc
    
            if(jobData.category != prevCategory){
                jobData.updates = [...jobData.updates, {
                    category: jobData.category,
                    timeStamp: new Date().getTime()
                }]
            }

            dispatch(
                editJob(jobData)
            );
            await updateJob(currentUser.uid, jobData)
            handleClose();
    
        }catch(error){
            setOpenSnackbar(true)
            setSeverity("error")
            setMessage(error.message)
            console.error("Error Updating Job: ", error);
        }
    };

    const handleDelete = async () => {
        try{
            await removeJob(currentUser.uid, jobData.id)

            dispatch(
                deleteJob(id)
            )
            handleClose()
        }catch(error){
            setOpenSnackbar(true)
            setSeverity("error")
            setMessage(error.message)
            console.error("Error Deleting Job: ", error);
        }
    }

    return (
        <Dialog maxWidth="md" fullWidth={true} open={open} onClose={handleClose}>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'row'}}>
                <Grid container spacing={2} marginTop={'5px'}>

                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                size="sm"
                                placeholder="Company Name"
                                label="Company Name"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}/>
                        </Grid>
                        
                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessCenterIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                size="sm"
                                placeholder="Position"
                                label="Position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}/>
                        </Grid>
                        
                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <Select
                                sx={{minWidth: '195px'}}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}> 
                                    {categories.map((category) => {
                                        return <MenuItem value={category}>{category}</MenuItem>
                                    })}
                            </Select>
                        </Grid>

                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                size="sm"
                                placeholder="Salary"
                                label="Salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value.trim())}/>
                        </Grid>
                        
                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <Select
                                sx={{minWidth: '195px'}}
                                value={jobType}
                                onChange={(e) => {setJobType(e.target.value)}}>
                                    {job_type.map((type) => {
                                        return <MenuItem value={type}>{type}</MenuItem>
                                    })}
                            </Select>
                        </Grid>
                        
                        <Grid item xs={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PlaceIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                size="sm"
                                placeholder="Location"
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}/>
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <AddLinkIcon />
                                        </InputAdornment>
                                    ),
                                    }}
                                fullWidth
                                size="lg"
                                placeholder="URL"
                                label="URL"
                                value={url}
                                onChange={(e) => setURL(e.target.value.trim())}/>
                        </Grid>



                        <Grid item xs={12}>
                            <Typography fontWeight='bold' variant="subtitle1">Description</Typography>
                            <TextField
                                fullWidth
                                multiline
                                InputLabelProps={{shrink: false}}
                                rows={5}
                                placeholder="Description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}/>
                        </Grid>
                </Grid>

            </DialogContent>
            <DialogActions sx={{display:'flex', justifyContent: 'flex-end'}}>
                <Button onClick={handleDelete} variant='contained' color='error'>Delete</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save & Close
                </Button>
            </DialogActions>

            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={onCloseSnackbar}>
            <Alert severity={severity} sx={{ width: '100%' }} onClose={onCloseSnackbar}>
                {message}
            </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default EditJobDialog;