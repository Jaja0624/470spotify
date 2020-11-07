import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography } from '@material-ui/core';

interface IObj {
    name: string,
    derp: {},
    awag: string[],
}

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    someBoolean: boolean,
    someFunc: (myObj: IObj) => void,
    optionalProp?: number

}

// FC (function component)
const ComponentBoilerPlate: React.FC<CustomPropsLol> = ({history, someBoolean, someFunc, optionalProp = 1241}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const asdf = globalStore((state) => state.isGroupDrawerOpen);
    const [text, setText] = useState('Placeholder Text');

    // executed when component is mounted
    useEffect(() => {
        console.log('this component is mounted');
    })

    // executed every time text is changed
    useEffect(() => {
        console.log('text changed');
    }, [text])

    return (
        <div className={classes.root} onClick={() => setText('hhhh')}>
            <Typography variant='h6' color='primary'>{text}</Typography>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor:'red'
        },
    }),
);

export default withRouter(ComponentBoilerPlate) // withRouter enables us to use the router even though this component is not a "Route"