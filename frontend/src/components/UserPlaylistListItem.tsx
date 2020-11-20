import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';
import { rootCertificates } from 'tls';


interface Props extends RouteComponentProps {
    playlistData: any, 
    selected?: boolean,
    selectedPlaylistId?: string,
    selectable?: boolean,
    selectHandler: (event: any, key: any) => void
}

const UserPlaylistListItem: React.FC<Props> = ({history, playlistData, selected = false, selectable, selectHandler}: Props) => {
    const classes = useStyles();

    return (
        <ListItem button className={`${classes.root} ${selected === playlistData.id && selectable && classes.selectedModifier}`} key={playlistData.id} onClick={(ev) => selectHandler(ev, playlistData)}>
            <ListItemAvatar>
                {playlistData?.images[0]?.url && <Avatar src={playlistData.images[0].url}/>}
            </ListItemAvatar>
            {selected === playlistData.id ? (
                <ListItemText
                    primary={playlistData.name}
                    classes={{root: classes.textModifier}}
                />
            ) : (
                <ListItemText
                    primary={playlistData.name}
                />
            )}
            
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

export default withRouter(UserPlaylistListItem) // withRouter enables us to use the router even though this component is not a "Route"