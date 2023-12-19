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
    Alert
} from "@mui/material";
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
            <DialogTitle>Create a New Job</DialogTitle>
            <DialogContent>
                <Container fixed disableGutters sx={{display:'flex', flexDirection: 'column'}}>
                    <Box sx={{width: '100%', display:'flex', justifyContent: 'space-around'}}>
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Company Name*</Typography>
                            <TextField
                                InputLabelProps={{shrink: false}}
                                size="sm"
                                placeholder="Company Name"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}/>
                        </Box>
                        
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Position*</Typography>
                            <TextField
                                InputLabelProps={{shrink: false}}
                                size="sm"
                                placeholder="Position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}/>
                        </Box>
                        
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Category*</Typography>
                            <Select
                                sx={{minWidth: '195px'}}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}> 
                                    {categories.map((category) => {
                                        return <MenuItem value={category}>{category}</MenuItem>
                                    })}
                            </Select>
                        </Box>
                    </Box>

                    <Box sx={{width: '100%', display:'flex', justifyContent: 'space-around'}}>
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Salary</Typography>
                            <TextField
                                InputLabelProps={{shrink: false}}
                                size="sm"
                                placeholder="Salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value.trim())}/>
                        </Box>
                        
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Job Type</Typography>
                            <Select
                                sx={{minWidth: '195px'}}
                                value={jobType}
                                onChange={(e) => {setJobType(e.target.value)}}>
                                    {job_type.map((type) => {
                                        return <MenuItem value={type}>{type}</MenuItem>
                                    })}
                            </Select>
                        </Box>
                        
                        <Box>
                            <Typography fontWeight='bold' variant="subtitle1">Location</Typography>
                            <TextField
                                InputLabelProps={{shrink: false}}
                                size="sm"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}/>
                        </Box>
                    </Box>

                    <Box sx={{width: '100%', display:'flex', justifyContent: 'space-around'}}>
                        <Box sx={{width: '100%', paddingX: '48px'}}>
                            <Typography fontWeight='bold' variant="subtitle1">URL</Typography>
                            <TextField
                                fullWidth
                                size="lg"
                                InputLabelProps={{shrink: false}}
                                placeholder="URL"
                                value={url}
                                onChange={(e) => setURL(e.target.value.trim())}/>
                        </Box>
                    </Box>

                    <Box sx={{width: '100%', display:'flex', justifyContent: 'space-around'}}>
                        <Box sx={{width: '100%', paddingX: '48px'}}>
                            <Typography fontWeight='bold' variant="subtitle1">Description</Typography>
                            <TextField
                                fullWidth
                                multiline
                                InputLabelProps={{shrink: false}}
                                rows={5}
                                placeholder="Description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}/>
                        </Box>
                    </Box>
                </Container>

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