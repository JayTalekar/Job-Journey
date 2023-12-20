import React, { useState, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { addJob } from "../../actions";
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
import {v4 as uuid} from "uuid"
import { addJob as writeJob } from "../../firebase/FirestoreFunctions";
import { AuthContext } from "../../context/AuthContext";
import { validateCompanyName, validateJobPositionTitle, validateSalary, validateLocationName, validateURL, validateDescription } from '../../helpers'


const AddJobDialog = ({onCloseCallback, forCategory}) => {
    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch();
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [category, setCategory] = useState(forCategory? forCategory: categories[0]);
    const [jobType, setJobType] = useState(job_type[0])
    const [location, setLocation] = useState("")
    const [url, setURL] = useState("")
    const [desc, setDesc] = useState("")
    const [open, setOpen] = useState(true);

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("")

    const onCloseSnackbar = () => setOpenSnackbar(false)

    const handleClose = () => {
        setOpen(false);
        onCloseCallback()
    };

    const handleSave = async () => {
        try{
            if(company.length == 0) throw new Error("Company Name is Required")
            validateCompanyName(company)
            if(position.length == 0) throw new Error("Position is Required")
            validateJobPositionTitle(position)
            if(salary) validateSalary(salary)
            if(location) validateLocationName(location)
            if(url) validateURL(url)
            if(desc) validateDescription(desc)

            const newJob = {
                id: uuid(),
                position: position.trim(),
                company: company.trim(),
                salary: salary,
                category: category,
                jobType: jobType,
                location: location.trim(),
                url: url,
                desc: desc.trim(),
                created_on: new Date().getTime(),
                created_category: category,
                updates: []
            }

            await writeJob(currentUser.uid, newJob)

            dispatch(
                addJob(newJob)
            );
            handleClose();
        }catch(error){
            setOpenSnackbar(true)
            setSeverity("error")
            setMessage(error.message)
            console.error("Error Adding Job: ", error);
        }
    };

    return (
        <Dialog  key={"add_job_dialog"} maxWidth="md" fullWidth={true} open={open}>
            <DialogTitle>Create a New Job</DialogTitle>
            <DialogContent>
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
                                label="URL"
                                placeholder="URL"
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
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
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

export default AddJobDialog;