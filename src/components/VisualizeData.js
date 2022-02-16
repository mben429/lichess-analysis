import React, { useState, useEffect } from 'react';
import { Stack, Grid, Paper, Box } from '@mui/material';
import Button from '@mui/material/Button';
import '../App.css';
import { useParams, useNavigate , useLocation} from "react-router-dom";
import { ThemeProvider, sizing } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { Bar, Line, Doughnut} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

// THIS WORKS!
// NEXT STEP: 
// Function called from here needs to grab elo data from DataCentre.js



export function VisualizeData() {

    const navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams();
    const game_data = location.state
    const num_games = game_data.length

    console.log("Username: ", username);
    console.log("Game Data: ", game_data);
    
    const handleOnClick = () => {
        navigate("/");
    }

    const theme = createTheme({
        palette: {
            background: {
                paper: 'rgb(11, 25, 50)',
                inner: 'RGB(11, 25, 41)',
            }
        }
    })


    // Get player ratings
    const getUserRating = (username, players_data, player) => {

        if (players_data.black.user.name == username) {
            if (player == "user"){
                return players_data.black.rating + players_data.black.ratingDiff;
            }
            else if (player == "opp"){
                return players_data.white.rating + players_data.white.ratingDiff;
            }
        }

        else {
            if (player == "user"){
                return players_data.white.rating + players_data.white.ratingDiff;
            }
            else if (player == "opp"){
                return players_data.black.rating + players_data.black.ratingDiff;
            }
        }
    }

    const getGameType = (curr_game) => {
        return curr_game.speed;
    }

    // Retrieve elo array for bullet, blitz, classical and rapid
    function getEloRatingArray() {
        
        let elo_2d_arr = [];
        let elo_arr_bullet = [], elo_arr_blitz = [], elo_arr_rapid = [], elo_arr_classical = [];
        let curr_game;

        for (let i = 0; i < game_data.length; i++) {
            
            curr_game = game_data[i];

            if (getGameType(curr_game) == 'bullet') {
                elo_arr_bullet.push(getUserRating(username, curr_game.players, "user"));
            }
            else if (getGameType(curr_game) == 'blitz') {
                elo_arr_blitz.push(getUserRating(username, curr_game.players, "user"));
            }
            else if (getGameType(curr_game) == 'rapid') {
                elo_arr_rapid.push(getUserRating(username, curr_game.players, "user"));
            }
            else if (getGameType(curr_game) == 'classical') {
                elo_arr_classical.push(getUserRating(username, curr_game.players, "user"));
            }
        }
        elo_2d_arr.push(elo_arr_bullet.reverse(), elo_arr_blitz.reverse(), elo_arr_rapid.reverse(), elo_arr_classical.reverse());


        return elo_2d_arr;

    }

    function getLabelEloProg(){
        let label_arr = [];
        for (let i = 1; i <= 100; i+=1){
            label_arr.push(i);
        }
        return label_arr;
    }    


    const elo_prog_chart_data = {
        labels: getLabelEloProg(),
        datasets: [
            {
                label: 'bullet (< 3 min)',
                data: getEloRatingArray()[0],
                borderColor: "rgb(78, 193, 193)"
            },
            {
                label: 'bltz (< 8 min)',
                data: getEloRatingArray()[1],
                borderColor: "rgb(255, 203, 40)"
            },
            {
                label: 'rapid (< 25 min)',
                data: getEloRatingArray()[2],
                borderColor: "rgb(153, 152, 153)"
            },
            {
                label: 'classical (< 360 min)',
                data: getEloRatingArray()[3],
                borderColor: 'rgb(249, 1, 64)'
            }
        ],
    };

    const elo_prog_chart_options = {
        scales:{
            xAxes:{
                title: {
                    display: true,
                    text: 'Game No.'
                }
            },
            yAxes: {
                title: {
                    display: true,
                    text: 'Elo Rating'
                }
            }
        },
        responsive: true
    
    }

    const getEloDiffs = (elo_arr) => {
        let bullet_diff = elo_arr[0][elo_arr[0].length-1] - elo_arr[0][0];
        let blitz_diff =  elo_arr[1][elo_arr[1].length-1] - elo_arr[1][0];
        let rapid_diff = elo_arr[2][elo_arr[2].length-1] - elo_arr[2][0];
        let classical_diff = elo_arr[3][elo_arr[3].length-1] - elo_arr[3][0];

        let diff_arr = [bullet_diff, blitz_diff, rapid_diff, classical_diff];

        return diff_arr;
    }

    const getArrowType = (diff_val) => {

        if (diff_val > 0) {
            return <ArrowUpwardRoundedIcon color="success" fontSize="large"/>
        }
        else if (diff_val < 0) {
            return <ArrowDownwardRoundedIcon color="error" fontSize="large" />
        }
        else if (diff_val == 0) {
            return <CodeRoundedIcon color="warning" fontSize="large" />
        }
        else {
            return <BlockRoundedIcon color="info" fontSize="large"/>
        }

    }

    const averageArr = (arr) => {
        let ret_sum = 0;
        for (let i = 0; i <arr.length; i++){
            ret_sum += arr[i];
        }
        return Math.floor(ret_sum / arr.length);
    }

    const getRatingAvg = (elo_arr) => {
        let rating_avg_arr = [averageArr(elo_arr[0]), averageArr(elo_arr[1]), averageArr(elo_arr[2]), averageArr(elo_arr[3])];
        return rating_avg_arr;
    }


    return (
            <ThemeProvider theme={theme}>
                <Stack spacing={3}>
                    <h1 className="vis-title">Welcome, <span className="other-color sub">{username}</span></h1>
                    {/*Grid Row 1*/}
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {/*1-1*/}
                        <Grid item xs={7.5}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: 500,
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={5} justifyContent="center">
                                    <Grid item xs={12}><h2 className="paper-txt lft-txt">Rating Progression <span className="other-color sub">|</span> (Last 100 Games)<span className="other-color sub">.</span></h2></Grid>
                                    <Grid item xs={12}>
                                        <div className="paper-txt fill-container">
                                            <Line data={elo_prog_chart_data} options={elo_prog_chart_options}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {/*1-2*/}
                        <Grid item xs={2}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: 500,
                                    padding: 2
                                }}
                            >
                                <Stack spacing={2}>
                                    <h2 className="paper-txt">Rating Diffs<span className="other-color sub">.</span></h2>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Bullet Rating Diff</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2">
                                                    {getArrowType(getEloDiffs(getEloRatingArray())[0])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{getEloDiffs(getEloRatingArray())[0]}</div>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Blitz Rating Diff</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2">
                                                    {getArrowType(getEloDiffs(getEloRatingArray())[1])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{getEloDiffs(getEloRatingArray())[1]}</div>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Rapid Rating Diff</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2">
                                                    {getArrowType(getEloDiffs(getEloRatingArray())[2])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{getEloDiffs(getEloRatingArray())[2]}</div>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Classical Rating Diff</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2">
                                                    {getArrowType(getEloDiffs(getEloRatingArray())[3])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{getEloDiffs(getEloRatingArray())[3]}</div>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                </Stack>
                            </Paper>
                        </Grid>
                        {/*1-3*/}
                        <Grid item xs={2}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: 500,
                                    padding: 2
                                }}
                            >
                                <Stack spacing={2}>
                                    <h2 className="paper-txt">Average Rating<span className="other-color sub">.</span></h2>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(2, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Average Bullet Rating</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2" className="paper-txt-num">
                                                    {getRatingAvg(getEloRatingArray())[0]}
                                                </Box>
                                                
                                                
                                            </Box>
                                        </Box>
                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Average Blitz Rating</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2" className="paper-txt-num">
                                                    {getRatingAvg(getEloRatingArray())[1]}
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Average Rapid Rating</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2" className="paper-txt-num">
                                                    {getRatingAvg(getEloRatingArray())[2]}
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            bgcolor: 'background.inner',
                                            height: 70,
                                            padding: 1
                                        }}
                                    >
                                        <Box className="paper-txt" sx={{ width: 1 }}>
                                            <Box display="grid" gridTemplateRows="repeat(3, 1fr)" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                                                <Box gridColumn="span 12" gridRow="span 1">
                                                    <div className="sm-paper-txt-title">Average Classical Rating</div>
                                                </Box>
                                                <Box gridColumn="span 1" gridRow="span 2" className="paper-txt-num">
                                                    {getRatingAvg(getEloRatingArray())[3]}
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ height: 25}}>

                    </Box>
                    <Button 
                        className="general-btn" 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            handleOnClick();
                        }}
                    >
                        Back
                    </Button>
                    <Box sx={{ height: 100}}>
                    
                    </Box>
                </Stack>
            </ThemeProvider>

        
    )

}