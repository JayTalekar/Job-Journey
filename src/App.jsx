// React, Redux and Router hooks
import { useState } from 'react'
import {Routes, Route, NavLink, Link} from 'react-router-dom'
import { useSelector } from 'react-redux';

//Mui Components
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Container } from '@mui/material';

//Mui Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContactsIcon from '@mui/icons-material/Contacts';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TuneIcon from '@mui/icons-material/Tune';

//Importing all Pages
import {DashboardPage}  from './components/DashboardPage';
import {StatisticsPage} from './components/StatisticsPage';
import {ContactsPage} from './components/ContactsPage';
import {DocumentsPage} from './components/DocumentsPage'
import {SettingsPage} from './components/SettingsPage'

import {AuthProvider} from './context/AuthContext'
import { HomePage } from './components/HomePage';
import { Navigation } from './components/Navigation';
import {PrivateRoute} from './components/PrivateRoute'
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import { PublicRoute } from './components/PublicRoute';
import {ErrorPage} from './components/ErrorPage'
function App() {

  return(
    <AuthProvider>

      <Box sx={{display: 'flex'}}>

        <Navigation/>

        <Container maxWidth={false} disableGutters sx={{marginTop: "60px", marginX: '10px', overflow: 'hidden'}}>
          <Routes>
            {/*Public Routes */}
            <Route path='/' element={<PublicRoute/>}>
              <Route path="/" element={<HomePage/>}/>
            </Route>

            <Route path='/signin' element={<PublicRoute/>}>
              <Route path='/signin' element={<SignInPage />} />
            </Route>

            <Route path='/signup' element={<PublicRoute/>}>
              <Route path='/signup' element={<SignUpPage />} />
            </Route>

            {/*Protected Routes*/}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path={"/dashboard"} element={<DashboardPage/>} />
            </Route>

            <Route path="/statistics" element={<PrivateRoute />}>
              <Route path={"/statistics"} element={<StatisticsPage/>} />
            </Route>

            <Route path="/contacts" element={<PrivateRoute />}>
              <Route path={"/contacts"} element={<ContactsPage/>} />
            </Route>

            <Route path="/documents" element={<PrivateRoute />}>
              <Route path={"/documents"} element={<DocumentsPage/>} />
            </Route>

            <Route path="/settings" element={<PrivateRoute />}>
              <Route path={"/settings"} element={<SettingsPage/>} />
            </Route>

            
              <Route path="*" element={<ErrorPage/>} />
          
          </Routes>
        </Container>
      </Box>
    </AuthProvider>
  )
}

export default App
