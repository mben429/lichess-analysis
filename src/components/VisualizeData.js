import React, { useState } from 'react';
import { Grid , Stack} from '@mui/material';
import Button from '@mui/material/Button';
import '../App.css';
import { UsernameForm } from './UsernameForm';
import { useParams, useNavigate , useLocation} from "react-router-dom";


export function VisualizeData() {

    const navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams();

    const game_data = location.state

    console.log("Username: ", username);
    console.log("Game Data: ", game_data);
    console.log("Data Type", typeof(game_data));
    console.log(game_data[0].id)
    console.log(typeof(game_data[0].id))
    
    const handleOnClick = () => {
        navigate("/");
    }

    return (
        <div>
            <Stack spacing={3}>
                <h1 className="homepage-title">Welcome, <span className="other-color sub">{username}</span></h1>
                <Button 
                    className="general-btn" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                        handleOnClick();
                    }}
                >
                    Back
                </Button>
            </Stack>
        </div>
        
    )

}