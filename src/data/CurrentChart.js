import React, { useState, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Line, Bar, getElementsAtEvent} from 'react-chartjs-2';
import * as dataProcess from './DataProcess';
import * as data from './Data';
import Chart from 'chart.js/auto';

// This component returns the correct chart based on props.type
export default function CurrentChart(props) {

    console.log("PROPS: ", props.type, props.username, props.game_data, props.elo_array);
    
    const getOpeningsDataObj = () => {
        let opening_arr_white = [], openings_arr_black = [];
        let curr_game;

        let game_data = props.game_data, username = props.username;
    
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

    const setProgChartOptions = () => {
        let elo_prog_chart_options = {
            scales:{
                xAxes:{
                    title: {
                        display: true,
                        text: 'Game No.',
                        font: {
                            size: 7
                        }
                    }
                },
                yAxes: {
                    title: {
                        display: true,
                        text: 'Elo Rating'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 7
                        }
                    }
                }
            }
        }
        return elo_prog_chart_options;
    }
    
    const setOpeningsBarGraphOptions = () => {
        let openings_chart_options = {
            scales:{
                xAxes:{
                    title: {
                        display: true,
                        text: 'Opening'
                    },
                    ticks: {
                        font: {
                            size: 7
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
    
        return openings_chart_options;
    }

    const getChart = () => {
        if (props.type == "elo_prog_line_graph") {
            return <Line data={data.getEloProgData(props.elo_array, null)} options={setProgChartOptions()} />
        }
        else if (props.type == "openings_white_bar") {
            return <Bar data={data.getWhiteOpeningsBarData(getOpeningsDataObj()[0])} options={setOpeningsBarGraphOptions()} />
        }
        else if (props.type == "openings_black_bar") {
            return <Bar data={data.getBlackOpeningsBarData(getOpeningsDataObj()[1])} options={setOpeningsBarGraphOptions()} />
        }
    }
    return (
        <div>{getChart()}</div>
    )

}

