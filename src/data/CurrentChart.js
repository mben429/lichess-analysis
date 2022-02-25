import React, { useState, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Line, Bar, getElementsAtEvent} from 'react-chartjs-2';
import * as dataProcess from './DataProcess';
import * as data from './Data';
import Chart from 'chart.js/auto';
import { theme } from '../styles/Themes';

// This component returns the correct chart based on props.type
export default function CurrentChart(props) {

    const chartRefWhite = useRef();
    const chartRefBlack = useRef();
    let axesTitleFontSize;
    let axesFontSize;
    let legendFontSize;
    let legendBoxSize;
    let barThickness;
    let lineWidth;
    let pointBorderWidth;
    let barxAxesDisplay;
    let barBorderWidth;

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
        for (let i = 0; i < props.game_data.length; i++){
            curr_game = props.game_data[i];
            // When current game opening matches opening clicked on, return the eco associated with it.
            if (curr_game.opening.name == openings_white[index]){
                return curr_game.opening.eco;
            }
        }
    }

    const getEcosBlack = (index, openings_black) => {
        let curr_game;
        for (let i = 0; i < props.game_data.length; i++){
            curr_game = props.game_data[i];
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


    // What needs to be responsive? 
    // xAxis title, yAxes title, label font size, label box size, chart width/height
    const setProgChartOptions = () => {

        console.log("ARGS: ", axesTitleFontSize, axesFontSize, legendFontSize, legendBoxSize, lineWidth)

        let elo_prog_chart_options = {
            scales:{
                xAxes:{
                    title: {
                        display: true,
                        text: 'Game No.',
                        font: {
                            size: axesTitleFontSize
                        }
                    },
                    ticks: {
                        font: {
                            size: axesFontSize
                        }
                    }
                },
                yAxes: {
                    title: {
                        display: true,
                        text: 'Rating (Elo)',
                        font: {
                            size: axesTitleFontSize
                        }
                    },
                    ticks: {
                        font: {
                            size: axesFontSize
                        }
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: legendFontSize
                        },
                        boxWidth: legendBoxSize
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: lineWidth
                },
                point: {
                    borderWidth: pointBorderWidth
                }
            }
        }

        return elo_prog_chart_options;
    }
    
    // WHat needs to be responsive? 
    // xAxis title, yAxes title, bar thickness, chart width/height
    const setOpeningsBarGraphOptions = () => {
        let openings_chart_options = {
            scales:{
                xAxes:{
                    title: {
                        display: true,
                        text: 'Opening',
                        font: {
                            size: axesTitleFontSize
                        }
                    },
                    ticks: {
                        display: barxAxesDisplay
                    }
                },
                yAxes: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            size: axesTitleFontSize
                        }
                    },
                    ticks: {
                        font: {
                            size: axesFontSize
                        }
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

    const setChartOptionStates = () => {


        if (useMediaQuery(theme.breakpoints.between('xxs', 'xs')) == true){
            axesFontSize = 7;
            axesTitleFontSize = 9;
            legendFontSize = 9;
            legendBoxSize = 15;
            lineWidth = 1;
            pointBorderWidth = 0.05;
            barxAxesDisplay = false;
            barThickness = 7;
            barBorderWidth = 0.5;
             
        }

    }

    const getChart = () => {

        // Set the states for chart options
        setChartOptionStates();

        // Display correct graph
        if (props.type == "elo_prog_line_graph") {
            return <Line
                data={data.getEloProgData(props.elo_array, null)} 
                options={setProgChartOptions()} />
        }
        else if (props.type == "openings_white_bar") {
            return <Bar 
                data={data.getWhiteOpeningsBarData(getOpeningsDataObj()[0], barThickness, barBorderWidth)} 
                options={setOpeningsBarGraphOptions()} 
                ref={chartRefWhite} 
                onClick={handleBarClickWhite} />
        }
        else if (props.type == "openings_black_bar") {
            return <Bar 
                data={data.getBlackOpeningsBarData(getOpeningsDataObj()[1], barThickness, barBorderWidth)} 
                options={setOpeningsBarGraphOptions()} 
                ref={chartRefBlack} 
                onClick={handleBarClickBlack} />
        }
    }
    return (
        <div>{getChart()}</div>
    )

}

