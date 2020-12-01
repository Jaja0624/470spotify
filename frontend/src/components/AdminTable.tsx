import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tabIndex: number
}

// FC (function component)
const AdminTable: React.FC<CustomPropsLol> = ({history, tabIndex}: CustomPropsLol) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: 'column'
        },

        input: {
            position: 'fixed',
            bottom: 0,
            textAlign: 'center',
            flexGrow: 1,
            paddingLeft: 10,
            paddingBottom: 35
        },

        table: {
          minWidth: 650,
        },
    }),
);

export default withRouter(AdminTable) // withRouter enables us to use the router even though this component is not a "Route"
