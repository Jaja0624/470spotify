import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

interface CustomPropsLol extends RouteComponentProps {
    searchData: any
}

const SearchResults: React.FC<CustomPropsLol> = ({history, searchData}: CustomPropsLol) => {
    const classes = useStyles();
    const getArtists = (artists: []) => {
        var arr : any = [];
        artists.forEach(element => {
            arr.push(element['name']);
        })
        return arr.join(', ');
    }

    return (
        <ListItem button className={classes.root}>
            <ListItemAvatar>
            {
                searchData?.album.images[0]?.url && <Avatar src={searchData.album.images[0].url}/>
            }
            </ListItemAvatar>
            <ListItemText
                primary={searchData.name}
                secondary={getArtists(searchData.artists)}
            />
        </ListItem>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft:5,
            justifyContent:'center',
            alignItems:'center',
            width: '100%',
        },
        selectedModifier: {
            backgroundColor: theme.palette.primary.dark,
        },
        textModifier:{
            textDecoration:"underline"
        }
    }),
);

export default withRouter(SearchResults) // withRouter enables us to use the router even though this component is not a "Route"