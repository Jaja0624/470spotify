import React from 'react';
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import SearchResults from '../components/SearchResults'
import { List } from '@material-ui/core';

interface CustomPropsLol extends RouteComponentProps {}
// FC (function component)
const SearchContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const globalState = globalStore();

    return (
        <div className={classes.root}>
            <List>
            {
                globalState.searchResults && globalState.searchResults.map((result: any) => {
                    return (<SearchResults key={result.uri} searchData={result}/>)
                }
            )}
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

export default withRouter(SearchContainer) // withRouter enables us to use the router even though this component is not a "Route"