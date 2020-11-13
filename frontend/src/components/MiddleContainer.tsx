import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button } from '@material-ui/core';
import UserPlaylists from './UserPlaylists'
import GroupInviteLinkModal from './GroupInviteLinkModal'
import { getMembers } from '../core/server'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const MiddleContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    async function scopedF() {
        if (userState?.currentGroup?.id) {
            const mems = await getMembers(userState.currentGroup?.id.toString());
            console.log("members", mems);
        } else {
            console.log(userState?.currentGroup?.id);
        }
    }

    const ifhandler = () => {
        if (globalState.middleContainer === 'group' && userState.currentGroup) {
            return (
                <div>
                    {userState.currentGroup.id}-
                    {userState.currentGroup.name}
                    <Button color='primary' variant='contained' onClick={() => {
                        setInviteModalVisible(true);
                    }}>Invite Link</Button>
                    <Button color='primary' variant='contained' onClick={async () => {
                        await scopedF();
                    }}>Group Members</Button>

                    <div>

                    </div>
                    <GroupInviteLinkModal 
                        isOpen={inviteModalVisible}
                        cancelHandler={() => setInviteModalVisible(false)}
                        />
                </div>
            )
        } else {
            return (
                <UserPlaylists/>
            )
        }
    }

    return (
        <div className={classes.root}>
            {ifhandler()}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign:'center',
            padding:15
        },
    }),
);

export default withRouter(MiddleContainer) // withRouter enables us to use the router even though this component is not a "Route"