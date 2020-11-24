
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import globalStore from '../store/global';
import MemberList from '../components/MemberList';

interface Props extends RouteComponentProps{
    //no props to send   
}

//The right hand container of the application. This component 
const RightContainer: React.FC<Props> = () => {
    const globalState = globalStore();

    //Gets the visible component depending on the state of the middle container
    const getVisibleComponent = (middleContainerState : string) => {
        if(middleContainerState !== 'group'){
            return (
                <div>
                    <TextField id="songSearch" label="Outlined" variant="outlined" />
                    <div>TODO: Place songname results from 'Outlined' here</div>
                </div>
            );
        }
        else {
            return (
                <MemberList/>
            );
        }
    };

    return (
        <div>
            {getVisibleComponent(globalState.middleContainer)}
        </div>
    );
};

export default withRouter(RightContainer);