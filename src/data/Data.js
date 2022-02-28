import * as dataProcess from './DataProcess';

export const getEloProgData = (elo_array, openings_obj) => {

    const chart_data = {
        labels: dataProcess.getLabelEloProg(),
        datasets: [
            {
                label: 'bullet (< 3 min)',
                data: elo_array[0],
                borderColor: "rgb(78, 193, 193)"
            },
            {
                label: 'bltz (< 8 min)',
                data: elo_array[1],
                borderColor: "rgb(255, 203, 40)"
            },
            {
                label: 'rapid (< 25 min)',
                data: elo_array[2],
                borderColor: "rgb(153, 152, 153)"
            },
            {
                label: 'classical (< 360 min)',
                data: elo_array[3],
                borderColor: 'rgb(249, 1, 64)'
            }
        ],
    };

    return chart_data

}

export const getWhiteOpeningsBarData = (openings_data, bar_thickness, borderWidth) => {
    const chart_data = {
        labels: dataProcess.getOpeningsCounts(openings_data)[0],
        datasets: [
            {
                barPercentage: 0.05,
                barThickness: bar_thickness,
                borderColor: "rgba(0, 0, 0, 0.9)",
                borderWidth: borderWidth,
                backgroundColor: "rgba(240, 240, 240, 0.8)",
                hoverBackgroundColor: "rgba(249, 0, 64, 1)",
                data: dataProcess.getOpeningsCounts(openings_data)[1]
            }
        ]
    }

    return chart_data;
} 

export const getBlackOpeningsBarData = (openings_data, bar_thickness, borderWidth) => {
    const chart_data = {
        labels: dataProcess.getOpeningsCounts(openings_data)[0],
        datasets: [
            {
                barPercentage: 0.05,
                barThickness: bar_thickness,
                borderColor: "rgba(240, 240, 240, 0.5)",
                borderWidth: borderWidth,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                hoverBackgroundColor: "rgba(249, 0, 64, 1)",
                data: dataProcess.getOpeningsCounts(openings_data)[1]
            }
        ]
    }
    return chart_data;
}