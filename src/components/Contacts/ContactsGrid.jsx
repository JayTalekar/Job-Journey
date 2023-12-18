import React from "react";
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { ContactCard } from "./ContactCard";

export const ContactsGrid = () => {
    const sampleData = [{
        id: 0,
        name: "Jay Talekar",
        position: "Software Developer",
        company: "Google",
    },
    {
        id: 1,
        name: "Deep Talekar",
        position: "Front-end Developer",
        company: "Meta"
    },
    {
        id: 2,
        name: "Shail Patel",
        position: "Software Engineer",
        company: "Uber"
    }
]

    return(
        <Grid container spacing={1} my={'10px'}>
            {sampleData.map(data => (
                <Grid item xs={2}>
                    <ContactCard contactData={data}/>
                </Grid>
            ))}
        </Grid>
    )

}