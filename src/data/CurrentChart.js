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
    let borderRadius;

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
            borderRadius = 10;
        }

        else if  (useMediaQuery(theme.breakpoints.between('xs', 'sm')) == true) {
            axesFontSize = 10;
            axesTitleFontSize = 11;
            legendFontSize = 12;
            legendBoxSize = 30;
            lineWidth = 2.5;
            pointBorderWidth = 0.1;
            barxAxesDisplay = false;
            barThickness = 13;
            barBorderWidth = 0.5; 
            borderRadius = 2;
        }

        else if(useMediaQuery(theme.breakpoints.between('sm', 'md')) == true) {
            axesFontSize = 11;
            axesTitleFontSize = 13;
            legendFontSize = 10;
            legendBoxSize = 25;
            lineWidth = 3;
            pointBorderWidth = 0.5;
            barxAxesDisplay = false;
            barThickness = 20;
            barBorderWidth = 2; 
            borderRadius = 2;
        }
        else if (useMediaQuery(theme.breakpoints.between('md', 'lg')) == true) {
            axesFontSize = 12;
            axesTitleFontSize = 15;
            legendFontSize = 12;
            legendBoxSize = 30;
            lineWidth = 2.5;
            pointBorderWidth = 1.5;
            barxAxesDisplay = false;
            barThickness = 22;
            barBorderWidth = 1.25; 
            borderRadius = 7;
        }
        else if (useMediaQuery(theme.breakpoints.between('lg', 'xl')) == true) {
            axesFontSize = 18;
            axesTitleFontSize = 18;
            legendFontSize = 17;
            legendBoxSize = 50;
            lineWidth = 3.5;
            pointBorderWidth = 2;
            barxAxesDisplay = false;
            barThickness = 23;
            barBorderWidth = 1.25; 
            borderRadius = 10;
        }
        else if (useMediaQuery(theme.breakpoints.up('xl')) == true) {
            axesFontSize = 24;
            axesTitleFontSize = 20;
            legendFontSize = 24;
            legendBoxSize = 60;
            lineWidth = 6.5;
            pointBorderWidth = 7.5;
            barxAxesDisplay = false;
            barThickness = 32;
            barBorderWidth = 1.25; 
            borderRadius = 10;
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
                data={data.getWhiteOpeningsBarData(getOpeningsDataObj()[0], barThickness, barBorderWidth, borderRadius)} 
                options={setOpeningsBarGraphOptions()} 
                ref={chartRefWhite} 
                onClick={handleBarClickWhite} />
        }
        else if (props.type == "openings_black_bar") {
            return <Bar 
                data={data.getBlackOpeningsBarData(getOpeningsDataObj()[1], barThickness, barBorderWidth, borderRadius)} 
                options={setOpeningsBarGraphOptions()} 
                ref={chartRefBlack} 
                onClick={handleBarClickBlack} />
        }
    }
    return (
        <div>{getChart()}</div>
    )

}

