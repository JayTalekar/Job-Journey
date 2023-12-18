import React from "react";
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { ContactCard } from "./ContactCard";
import { useSelector } from "react-redux";

export const ContactsGrid = () => {

    const contactsData = useSelector(state => state.contacts)

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