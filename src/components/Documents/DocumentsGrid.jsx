import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { DocumentCard } from "./DocumentCard";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentsData } from "../../firebase/StorageFunctions";
import { AuthContext } from "../../context/AuthContext";
import { setDocs } from '../../actions'

export const DocumentsGrid = ({jobId}) => {

    let docsData = useSelector(state => state.documents)
    const dispatch = useDispatch()

    const {currentUser} = useContext(AuthContext)
    async function getDocData(){
        if(docsData.length == 0){
            const allMetadata = await getDocumentsData(currentUser.uid)
            dispatch(
                setDocs(allMetadata)
            )
        }
    }

    useEffect(() => {
        getDocData()
    }, [])

    const [jobDocs, setJobDocs] = useState([])
    useEffect(() => {
        const data = docsData.filter(d => JSON.parse(d.linked_jobs).includes(jobId))
        setJobDocs(data)
    }, [jobId, docsData])

    return(
        <Grid container spacing={1} my={'10px'}>
            {!jobId && docsData.map(data => (
                <Grid key={data.id} item xs={2}>
                    <DocumentCard docData={data}/>
                </Grid>
            ))}

            {jobId && jobDocs.map(data => (
                <Grid key={data.id} item xs={2}>
                    <DocumentCard docData={data}/>
                </Grid>
            ))}
        </Grid>
    )

}