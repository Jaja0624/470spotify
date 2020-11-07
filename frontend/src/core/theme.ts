import { createMuiTheme }  from '@material-ui/core/styles'

// global theme
// material ui theming... 
// for more info: 
// https://material-ui.com/customization/theming/#theme-configuration-variables

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        drawer: {
            width: number;
            backgroundColor: string;
        };
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        drawer?: {
            width?: number;
            backgroundColor?: string;

        };
    }
}

const theme = createMuiTheme({
    palette: {
        type:'dark',
        primary: { 
            main: '#179443' 
        },
        secondary: { 
            main :'#191B1C',
            light: '#434343'
        }
    },
    drawer: {
        backgroundColor: '#1F1F23',
    },
    typography: {
        fontFamily: 'Comic Sans MS'
    },
    shape: {
        borderRadius: 15
    }
})

export default theme