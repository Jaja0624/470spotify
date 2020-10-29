import { createMuiTheme }  from '@material-ui/core/styles'

// global theme
// material ui theming: 
// https://material-ui.com/customization/theming/#theme-configuration-variables

const theme = createMuiTheme({
    palette: {
        primary: { 
            main: '#179443' 
        },
        secondary: { 
            main :'#E8E6E3'
        }
    },
    typography: {
        fontFamily: 'Comic Sans MS'
    },
    shape: {
        borderRadius: 15
    }
})

export default theme