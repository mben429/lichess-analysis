
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
            lg: 1450,
            xl: 1800
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