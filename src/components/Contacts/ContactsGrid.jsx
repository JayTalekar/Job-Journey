import React, {useEffect, useContext, useState} from "react";
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { ContactCard } from "./ContactCard";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { getContacts } from "../../firebase/FirestoreFunctions";
import { setContacts } from "../../actions";

export const ContactsGrid = ({jobId}) => {

    const contactsData = useSelector(state => state.contacts)
    const dispatch = useDispatch()

    const {currentUser} = useContext(AuthContext)

    async function getContactsData(){
        if(contactsData.length == 0){
            const contacts = await getContacts(currentUser.uid)
            dispatch(
                setContacts(contacts)
            )
        }
    }

    useEffect(() => {
        getContactsData()
    }, [])

    const [jobContacts, setJobContacts] = useState([])
    useEffect(() => {
        const data = contactsData.filter(cd => cd.linked_jobs.includes(jobId))
        setJobContacts(data)
    }, [jobId, contactsData])

    return(
        <Grid container spacing={1} my={'10px'}>
            {!jobId && contactsData.map(data => (
                <Grid item xs={2}>
                    <ContactCard contactData={data}/>
                </Grid>
            ))}

            {jobId && jobContacts.map(data => (
                <Grid item xs={2}>
                    <ContactCard contactData={data}/>
                </Grid>
            ))}
        </Grid>
    )

}