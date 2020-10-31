import { createMuiTheme }  from '@material-ui/core/styles'

// global theme
// material ui theming... 
// for more info: 
// https://material-ui.com/customization/theming/#theme-configuration-variables

const theme = createMuiTheme({
    palette: {
        type:'dark',
        primary: { 
            main: '#179443' 
        },
        secondary: { 
            main :'#191B1C'
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