import React from "react";
import { 
    Box, 
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Button
} from "@mui/material";

export function HomePage(){
    return (
        <Box display={'flex'} justifyContent={'center'} alignContent={'center'}> 
            <Typography variant="h4">Home Page</Typography>
        </Box>
    )
}
