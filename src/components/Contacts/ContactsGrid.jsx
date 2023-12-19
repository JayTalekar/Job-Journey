import React, {useEffect, useContext} from "react";
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

export const ContactsGrid = () => {

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

    return(
        <Grid container spacing={1} my={'10px'}>
            {contactsData.map(data => (
                <Grid item xs={2}>
                    <ContactCard contactData={data}/>
                </Grid>
            ))}
        </Grid>
    )

}