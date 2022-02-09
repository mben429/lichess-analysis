import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { VisualizeData } from './VisualizeData';
import { App } from '../App';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import '../App.css';
import { useNavigate } from "react-router-dom";


export function UsernameForm() {

    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [gameData, setGameData] = useState([]);

    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
        
        return (
            promiseInProgress && <h2>Generating.....</h2>
            );  
        }


    async function fetchData() {
        trackPromise(            
            fetch("/get_chess_game_data", {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "content-type": "application/json",
                },
                body:JSON.stringify(username)
            })
                .then(response => response.json())
                .then(data => {
                    setGameData(data);
                    // This is where we need to call VisualizeData.js or navigate to Insights page with username
                    navigate(`/insights/${username}`, {state:data});
                })
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Username:", username);
        
        // After form is submitted, go to fetch chess game data
        fetchData();
    }
    
    return (
        <div>
            <div className="center-screen">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <div>
                            <img src={require('../images/lichess_logo.png')} className="half-width-img"></img>
                        </div>
                        <h1 className="homepage-title">Lichess Insights Generator<span className="other-color">.</span></h1>
                        <h3>Enter your <span><a href="https://lichess.org/" target="_blank">Lichess.org</a></span> account username, and get access to interesting insights from your last <span className="other-color">100 games</span>.</h3>
                        <h3>If you do not have a lichess account, enter '<span className="other-color">melogm</span>' for a demo.</h3>
                        <TextField
                            required
                            id="enter-username-text" 
                            label="Enter Lichess Username" 
                            value={username}                   
                            onInput={ e=>setUsername(e.target.value) }
                            InputLabelProps={{
                                color: 'primary'
                            }}
                            color="primary"
                            focused
                        />
                        <Button 
                            className="general-btn" 
                            variant="contained"
                            type="submit"
                            color="success"
                        >
                            Generate Insights
                        </Button>
                        <LoadingIndicator />
                    </Stack>
                </form>
            </div>
        </div>
      );
    
}
