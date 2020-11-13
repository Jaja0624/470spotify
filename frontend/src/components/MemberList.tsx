import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, List, ListItem } from '@material-ui/core';
import { getMembers } from '../core/server'
import MemberListItem from './MemberListItem'
import CircularProgress from '@material-ui/core/CircularProgress';
 

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
}

interface IMems {
    group_uid: string,
    public_name: string,
    spotify_uid: string
}
// FC (function component)
const MemberList: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const [mems, setMems] = useState<Array<IMems>[]>([]);
    const [loading, setLoading] = useState(true);
    
    async function pullMembers() {
        if (userState?.currentGroup?.id) {
            const mems = await getMembers(userState.currentGroup?.id.toString());
            console.log("members", mems);
            setMems(mems.data);
        } else {
            console.log(userState?.currentGroup?.id);
        }
        setLoading(false);
    }

    useEffect(() => {
        console.log('hello');
        async function scopedPull() {
            await pullMembers();
        }
        scopedPull();
    }, [userState.userGroups])

    if (loading) {
        return (
            <div>
                <CircularProgress/>
            </div>
        )
    }
    
    return (
        <div className={classes.root}>
            <Typography>
                Members
            </Typography>
            <List>
              {mems.map((member: any) => {
                  return (<MemberListItem key={member.public_name} memberData={member} />)
              })}
            </List>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(MemberList) // withRouter enables us to use the router even though this component is not a "Route"