import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';


// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tracks:any
}

// FC (function component)
const TrackList: React.FC<CustomPropsLol> = ({history, tracks}: CustomPropsLol) => {
    const classes = useStyles();
    console.log(tracks);
    
    return (
        <div className={classes.root}>
            {tracks ? (
                <List>
                    {tracks.map((track: any) => {
                        return (
                            <ListItem button className={classes.root}>
                                <div>{track.track.name}</div>
                            </ListItem>
                        )
                    })}
                </List>
            ) : (
                <div>Empty</div>
            )}
            
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(TrackList) // withRouter enables us to use the router even though this component is not a "Route"