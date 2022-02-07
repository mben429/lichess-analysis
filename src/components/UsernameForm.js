import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { InputLabel } from '@mui/material';

export function UsernameForm() {

    const [username, setUsername] = useState("");
    const [gameData, setGameData] = useState([]);

    async function fetchData() {
        fetch("/get_chess_game_data", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content-type": "application/json",
            },
            body:JSON.stringify(username)
        })
            .then(response => response.json())
            .then(data => setGameData(data))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Username:", username);
        fetchData();
    }
    
    return (
        <div className="username-form-body">
            <div className="center-screen">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <h1 className="homepage-title">Lichess Insights Generator</h1>
                        <h3>Enter your Lichess account username, and get access to interesting insights from your last <text class="other-color">100 games</text>.</h3>
                        <h3>If you do not have a lichess account, enter '<text class="other-color">melogm</text>' for demo.</h3>
                        <TextField
                            id="enter-username-text" 
                            label="Enter Lichess Username" 
                            value={username}                   
                            onInput={ e=>setUsername(e.target.value) }
                            InputLabelProps={{
                                color: 'success'
                            }}
                            color="primary"
                            focused
                        />
                        <Button 
                            id="gen-insights-btn" 
                            variant="contained"
                            type="submit"
                        >
                            Generate Insights
                        </Button>
                    </Stack>
                </form>
            </div>
        </div>
      );
    
}

