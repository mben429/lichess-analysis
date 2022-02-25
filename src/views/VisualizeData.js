import React from 'react';
import { Stack, Grid, Paper, Box, Typography } from '@mui/material';
import '../App.css';
import { useParams, useLocation } from "react-router-dom";
import { ThemeProvider } from '@mui/system';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { BackButton } from '../components/BackButton';
import * as dataProcess from '../data/DataProcess';
import { theme } from '../styles/Themes';
import CurrentChart from '../data/CurrentChart';


export function VisualizeData() {

    // Two important variables
    const {username} = useParams();
    const location = useLocation();
    const game_data = location.state;

    console.log("Username: ", username);
    console.log("Game Data: ", game_data);


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
    

    // How to get responsive options? 
    // getResponsiveOptions() => This should return the options object {} 

    return (
            <ThemeProvider theme={theme}>
                <Stack spacing={3}>
                    <Typography><h1 className="vis-title">Welcome, <span className="other-color sub">{username}</span>.</h1></Typography>
                    <h3 className="sub-title">Insights extracted from last <span className="other-color">100</span> chess games on Lichess.org<span className="other-color">.</span> Only features standard <span className="other-color">bullet, blitz, rapid, and classical</span> games.</h3>
                    {/*Grid Row 1*/}
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {/*1-1*/}
                        <Grid item xs={7.5}>
                            <Paper 
                                elevation={10}
                                sx={{
                                    bgcolor: 'background.paper',
                                    height: {
                                        xxs: 300,
                                        xs: 300,
                                        sm: 400,
                                        md: 500,
                                        lg: 600,
                                        xl: 700
                                    },
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={5} justifyContent="center">
                                    <Grid item xs={12}><h2 className="row-1-header-txt paper-txt paper-txt-pad-left">Rating Progression<span className="other-color sub">.</span></h2></Grid>
                                    <Grid item xs={12}>
                                        <div className="paper-txt line-chart-container">
                                            <CurrentChart type="elo_prog_line_graph" username={username} game_data={game_data} elo_array={getEloRatingArray()} />
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
                                    height: {
                                        xxs: 325,
                                        xs: 500,
                                        sm: 600,
                                        md: 500,
                                        lg: 600,
                                        xl: 700
                                    },
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={5} justifyContent="center">
                                    <Grid item xs={12}>
                                        <h2 className="paper-txt txt-centre bar-chart-title">Opening Choice with White<span className="other-color sub">.</span></h2>
                                        <h5 className="paper-txt txt-centre">Hover on a bar for the opening name, <span className="other-color">click</span> on a bar for <span className="other-color">more information</span> about selected opening.</h5>
                                    </Grid>
                                    <Grid item xs={12} alignItems="center" justifyContent="center">
                                        <div className="paper-txt fill-container bar-chart-container">
                                            <CurrentChart type="openings_white_bar" username={username} game_data={game_data} elo_array={getEloRatingArray()} />
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
                                    height: {
                                        xxs: 325,
                                        xs: 500,
                                        sm: 600,
                                        md: 500,
                                        lg: 600,
                                        xl: 700
                                    },
                                    padding: 2
                                }}
                            >
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12}>
                                        <h2 className="paper-txt txt-centre bar-chart-title">Opening Choice with Black<span className="other-color sub">.</span></h2>
                                        <h5 className="paper-txt txt-centre">Hover on a bar for the opening name, <span className="other-color">click</span> on a bar for <span className="other-color">more information</span> about selected opening.</h5>
                                    </Grid>
                                    <Grid item xs={12} alignItems="center" justifyContent="center">
                                        <div className="paper-txt fill-container bar-chart-container">
                                            <CurrentChart type="openings_black_bar" username={username} game_data={game_data} elo_array={getEloRatingArray()} />
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