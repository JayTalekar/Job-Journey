import React, {useContext, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { setUserDetails, setupDashboard } from "../firebase/FirestoreFunctions"

//Mui components
import { 
    Box,
    Drawer,
    AppBar,
    CssBaseline,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Button,
    Divider,
    Popover,
    CardActions,
    CardContent,
    Card
} from "@mui/material";

//Mui Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContactsIcon from '@mui/icons-material/Contacts';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TuneIcon from '@mui/icons-material/Tune';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAuth } from "firebase/auth";
import { persistor } from "../store";

const drawerWidth = 200
const dashboard = 'Dashboard'
const statistics = 'Statistics'
const contacts = 'Contacts'
const documents = 'Documents'
const settings = 'Settings'


export function Navigation() {
    const {currentUser} = useContext(AuthContext)

    return currentUser ? <NavigateAuth user={currentUser}/> : <NavigateNonAuth/>
}

const NavigateAuth = ({user}) => {

    const dispatch = useDispatch()

    async function setupUser(){
        if(user){
            const currentTime = new Date().getTime()
            if(currentTime - user.metadata.createdAt < 10000){
                console.log("SETTING UP DATABASE")
                console.log(user.metadata.createdAt - currentTime)
                await setupDashboard(user.uid)

                if(!user.displayName)
                    user.displayName = getAuth().currentUser.displayName
                    
                await setUserDetails(user.uid, user.displayName, user.email)
            }
        }
    }

    useEffect(() => {
        setupUser()

        return () => {
            console.log('User Setup Successfull!');
        }
    }, [])

    let boardName = useSelector((state) => state.board_name)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    function onOpenPopover(event){
        setAnchorEl(event.currentTarget)
    }

    function onClosePopover(){
        setAnchorEl(null)
    }

    function onClickLogout(){
        setAnchorEl(null)
        dispatch({
            type: "RESET_STATE"
        })
        persistor.purge()
        doSignOut()
    }
    

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>

                <Toolbar variant="dense" sx={{display:'flex', flexDirection: 'row'}}>
                    
                    <Typography sx={{ width: 200}} variant="h6" color="inherit">
                    Job Journey
                    </Typography>

                    <Typography sx={{flexGrow: 5}} variant="h5" color="inherit">
                    {boardName}
                    </Typography>

                    <Button variant="text" color="inherit" size="small"  display={'flex'} 
                        onClick={e => onOpenPopover(e)}>
                        <AccountCircleIcon/>
                        <Typography variant='h7'marginLeft={'5px'} >
                            {user.displayName}
                        </Typography>
                    </Button>

                    <Popover 
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={onClosePopover}>
                            <Card variant="outlined">
                                <CardContent sx={{paddingBottom: '0px', paddingTop: '10px'}}>
                                    <Typography variant="h5" sx={{ paddingBottom: '0px'}}>Account</Typography>
                                    <Divider/>
                                    <Typography variant="subtitle1" marginTop={'10px'}>You are logged in as <b>{user.displayName}</b></Typography>
                                    <Typography variant="subtitle1" marginBottom={'10px'}>Email: <b>{user.email}</b></Typography>
                                    <Divider/>
                                </CardContent>
                                <CardActions sx={{display: 'flex', justifyContent: 'flex-end', paddingX: '16px', paddingBottom: '10px'}}>
                                    <Button variant="contained" color="secondary" size="small" onClick={onClickLogout}>
                                        Logout
                                    </Button>
                                </CardActions>
                            </Card>
                    
                     </Popover>
                    
                </Toolbar>
            </AppBar>
            
            <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginTop: '50px' },
            }}
            >
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem key={dashboard} disablePadding>
                            <ListItemButton component={NavLink} to={"/dashboard"}>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary={dashboard}/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={statistics} disablePadding>
                            <ListItemButton component={NavLink} to={"/statistics"}>
                            <ListItemIcon>
                                <AnalyticsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={statistics}/>
                            </ListItemButton>
                        </ListItem>
                        
                        <ListItem key={contacts} disablePadding>
                            <ListItemButton component={NavLink} to={"/contacts"}>
                            <ListItemIcon>
                                <ContactsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={contacts}/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={documents} disablePadding>
                            <ListItemButton component={NavLink} to={"/documents"}>
                            <ListItemIcon>
                                <InsertDriveFileIcon/>
                            </ListItemIcon>
                            <ListItemText primary={documents}/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={settings} disablePadding>
                            <ListItemButton component={NavLink} to={"/settings"}>
                            <ListItemIcon>
                                <TuneIcon/>
                            </ListItemIcon>
                            <ListItemText primary={settings}/>
                            </ListItemButton>
                        </ListItem>

                    </List>
                </Box>
            </Drawer>
        </Box>
    )

}

const NavigateNonAuth = () => {

    return(
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>

                <Toolbar variant="dense" sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    
                    <Typography sx={{ width: 200, textDecoration: 'none'}} variant="h6" color="inherit" component={NavLink} to="/">
                        Job Journey
                    </Typography>

                    <Box>
                        <Button variant="contained" color="secondary" size="small" sx={{marginRight: '20px'}}
                            component={NavLink} to="/signin">
                            Login
                        </Button>
                        
                        <Button variant="contained" color="secondary" size="small"
                            component={NavLink} to="/signup">
                            Get Started
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}