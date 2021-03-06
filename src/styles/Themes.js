import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        background: {
            paper: 'rgb(11, 25, 50)',
            inner: 'RGB(11, 25, 41)',
        },
    },
    breakpoints: {
        values: {
            xxs:0,
            xs:450,
            sm:800,
            md: 1100,
            lg: 1500,
            xl: 2000
        }
    },
    components: {
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true
            }
        }
    }
})

export const paperSx = {
    bgcolor: 'background.paper',
    height: {
        xxs: 70,
        xs: 60,
        sm: 65,
        md: 90,
        lg: 130,
        xl: 160
    },
    padding: 2
}

export const paperSxLargeCol = {
    bgcolor: 'background.paper',
    height: {
        xxs: 300,
        xs: 360,
        sm: 450,
        md: 600,
        lg: 750,
        xl: 950
    },
    padding: 2
}

export const paperSxBarCharts = {
    bgcolor: 'background.paper',
    height: {
        xxs: 325,
        xs: 500,
        sm: 600,
        md: 650,
        lg: 900,
        xl: 1000
    },
    padding: 2
}