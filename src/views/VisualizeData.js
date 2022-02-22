import React, { useRef } from 'react';
import { Stack, Grid, Paper, Box } from '@mui/material';
import '../App.css';
import { useParams, useLocation } from "react-router-dom";
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { Bar, Line, getElementsAtEvent } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { BackButton } from '../components/BackButton';
import * as dataProcess from '../data/DataProcess';


export function VisualizeData() {

    // Two important variables
    const {username} = useParams();
    const location = useLocation();
    const game_data = location.state;

    const chartRefWhite = useRef();
    const chartRefBlack = useRef();

    console.log("Username: ", username);
    console.log("Game Data: ", game_data);


    const theme = createTheme({
        palette: {
            background: {
                paper: 'rgb(11, 25, 50)',
                inner: 'RGB(11, 25, 41)',
            }
        }
    })

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

    // Retrieve elo array for bullet, blitz, classical and rapid
    const getEloRatingArray = () => {
            
        let elo_2d_arr = [];
        let elo_arr_bullet = [], elo_arr_blitz = [], elo_arr_rapid = [], elo_arr_classical = [];
        let curr_game;

        for (let i = 0; i < game_data.length; i++) {
            
            curr_game = game_data[i];

            if (dataProcess.getGameType(curr_game) == 'bullet') {
                elo_arr_bullet.push(dataProcess.getUserRating(curr_game, "user", username));
            }
            else if (dataProcess.getGameType(curr_game) == 'blitz') {
                elo_arr_blitz.push(dataProcess.getUserRating(curr_game, "user", username));
            }
            else if (dataProcess.getGameType(curr_game) == 'rapid') {
                elo_arr_rapid.push(dataProcess.getUserRating(curr_game, "user", username));
            }
            else if (dataProcess.getGameType(curr_game) == 'classical') {
                elo_arr_classical.push(dataProcess.getUserRating(curr_game, "user", username));
            }
        }
        elo_2d_arr.push(elo_arr_bullet.reverse(), elo_arr_blitz.reverse(), elo_arr_rapid.reverse(), elo_arr_classical.reverse());

        return elo_2d_arr;
    }
    
    const getOpeningsDataObj = () => {
        let opening_arr_white = [], openings_arr_black = [];
        let curr_game;
    
        for (let i = 0; i < game_data.length; i++) {
            curr_game = game_data[i];
    
            if (dataProcess.checkUserColor(curr_game, username) == "white") {
                opening_arr_white.push(curr_game.opening.name);
            }
            else {
                openings_arr_black.push(curr_game.opening.name);
            }            
        }
        return [opening_arr_white, openings_arr_black];
    }

    
    const getEcosWhite = (index, openings_white) => {
        let curr_game;
        for (let i = 0; i < game_data.length; i++){
            curr_game = game_data[i];
            // When current game opening matches opening clicked on, return the eco associated with it.
            if (curr_game.opening.name == openings_white[index]){
                return curr_game.opening.eco;
            }
        }
    }

    const getEcosBlack = (index, openings_black) => {
        let curr_game;
        for (let i = 0; i < game_data.length; i++){
            curr_game = game_data[i];
            // When current game opening matches opening clicked on, return the eco associated with it.
            if (curr_game.opening.name == openings_black[index]){
                return curr_game.opening.eco;
            }
        }
    }

    const handleBarClickWhite = (event) => {
        let active_element = getElementsAtEvent(chartRefWhite.current, event);
        let bar_index = active_element[0].index;
        let curr_opening_eco = getEcosWhite(bar_index, dataProcess.getOpeningsCounts(getOpeningsDataObj()[0])[0]);
        let url_str = `https://www.365chess.com/eco/${curr_opening_eco}`

        window.open(url_str, '_blank');
    }

    const handleBarClickBlack = (event) => {
        let active_element = getElementsAtEvent(chartRefBlack.current, event);
        let bar_index = active_element[0].index;
        let curr_opening_eco = getEcosBlack(bar_index, dataProcess.getOpeningsCounts(getOpeningsDataObj()[1])[0]);
        let url_str = `https://www.365chess.com/eco/${curr_opening_eco}`

        window.open(url_str, '_blank');
    }

    const elo_prog_chart_data = {
        labels: dataProcess.getLabelEloProg(),
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
    
    const common_openings_white_chart_data = {
        labels: dataProcess.getOpeningsCounts(getOpeningsDataObj()[0])[0],
        datasets: [
            {
                barPercentage: 0.05,
                barThickness: 15,
                borderColor: "rgb(0, 0, 0)",
                borderWidth: 2,
                backgroundColor: "rgba(240, 240, 240, 0.7)",
                hoverBackgroundColor: "rgba(249, 0, 64, 1)",
                data: dataProcess.getOpeningsCounts(getOpeningsDataObj()[0])[1]
            }
        ]
    }
    
    const common_openings_chart_options = {
        scales:{
            xAxes:{
                title: {
                    display: true,
                    text: 'Opening'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            yAxes: {
                title: {
                    display: true,
                    text: 'Frequency'
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        onHover: function(e) {
            e.native.target.style.cursor = 'pointer';
        },
        onLeave: function(e) {
            e.native.target.style.cursor = 'default';
        }
    }
    
    const common_openings_black_chart_data = {
        labels: dataProcess.getOpeningsCounts(getOpeningsDataObj()[1])[0],
        datasets: [
            {
                barPercentage: 0.05,
                barThickness: 15,
                borderColor: "rgb(255, 255, 255)",
                borderWidth: 0.3,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                hoverBackgroundColor: "rgba(249, 0, 64, 1)",
                data: dataProcess.getOpeningsCounts(getOpeningsDataObj()[1])[1]
            }
        ]
    }


    return (
            <ThemeProvider theme={theme}>
                <Stack spacing={3}>
                    <h1 className="vis-title">Welcome, <span className="other-color sub">{username}</span>.</h1>
                    <h3 className="sub-title">Insights extracted from last <span className="other-color">100</span> chess games on Lichess.org<span className="other-color">.</span> Only features standard <span className="other-color">bullet, blitz, rapid, and classical</span> games.</h3>
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
                                    <Grid item xs={12}><h2 className="paper-txt lft-txt">Rating Progression<span className="other-color sub">.</span></h2></Grid>
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
                                                    {getArrowType(dataProcess.getEloDiffs(getEloRatingArray())[0])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{dataProcess.getEloDiffs(getEloRatingArray())[0]}</div>
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
                                                    {getArrowType(dataProcess.getEloDiffs(getEloRatingArray())[1])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{dataProcess.getEloDiffs(getEloRatingArray())[1]}</div>
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
                                                    {getArrowType(dataProcess.getEloDiffs(getEloRatingArray())[2])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{dataProcess.getEloDiffs(getEloRatingArray())[2]}</div>
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
                                                    {getArrowType(dataProcess.getEloDiffs(getEloRatingArray())[3])}
                                                </Box>
                                                <Box gridColumn="span 2" gridRow="span 2">
                                                    <div className="paper-txt-num">{dataProcess.getEloDiffs(getEloRatingArray())[3]}</div>
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
                                                    {dataProcess.getRatingAvg(getEloRatingArray())[0]}
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
                                                    {dataProcess.getRatingAvg(getEloRatingArray())[1]}
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
                                                    {dataProcess.getRatingAvg(getEloRatingArray())[2]}
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
                                                    {dataProcess.getRatingAvg(getEloRatingArray())[3]}
                                                </Box>
                                            </Box>
                                        </Box>

                                    </Paper>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/*Grid Row 2*/}
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {/*2-1*/}
                        <Grid item xs={11}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: 600,
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={5} justifyContent="center">
                                    <Grid item xs={12}>
                                        <h2 className="paper-txt txt-centre bar-chart-title">Opening Choice with White<span className="other-color sub">.</span></h2>
                                    </Grid>
                                    <Grid item xs={12} alignItems="center" justifyContent="center">
                                        <div className="paper-txt fill-container chart-opening-white">
                                            <Bar className="bar-chart" ref={chartRefWhite} onClick={handleBarClickWhite} data={common_openings_white_chart_data} options={common_openings_chart_options}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/*Grid Row 3*/}
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {/*3-1*/}
                        <Grid item xs={11}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: 600,
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={5} justifyContent="center">
                                    <Grid item xs={12}>
                                        <h2 className="paper-txt txt-centre bar-chart-title">Opening Choice with Black<span className="other-color sub">.</span></h2>
                                    </Grid>
                                    <Grid item xs={12} alignItems="center" justifyContent="center">
                                        <div className="paper-txt fill-container chart-opening-white">
                                            <Bar className="bar-chart" ref={chartRefBlack} onClick={handleBarClickBlack} data={common_openings_black_chart_data} options={common_openings_chart_options}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    
                    
                    <Box sx={{ height: 25}}></Box>
                    <BackButton />
                    <Box sx={{ height: 100}}></Box>
                </Stack>
            </ThemeProvider>
    )

}