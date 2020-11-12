import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import Landing from './containers/Landing';
import Dashboard from './containers/Dashboard';
import NotFound from './containers/NotFound';
import userStore from './store/user'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './core/theme';
import AuthLoadingScreen from './containers/AuthLoadingScreen'
import InvitedUserScreen from './containers/InvitedUserScreen'
import { getGroupsHandler } from './core/serverhandler'

const App: React.FC = () => {
	const user = userStore();

	const getGroup = async ()  => {
		const groups = await getGroupsHandler();
		if (groups.length === 0) {
			// assume no new data
			// TODO: Actually verify if new data exists
			// server pushes new data (TBD)
			return;
		}
		user.setUserGroups(groups);
	}
	// when frontend loads, it will call the "all group" endpoint every 5s
	useEffect(() => {
		async function scopedGetGroup() {
            await getGroup();
        }
		scopedGetGroup();
		let intervalId = setInterval(async function() {
			if (user.spotifyProfile) {
				try {
					await scopedGetGroup();
				} catch (err) {
					console.log('App.tsx error', err)
				}
			}
		}, 5000);

		return () => {
			// execute when app unmounts
			clearInterval(intervalId);
		}
	}, [])


	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			<BrowserRouter>
				<Switch> 
					<Route exact path='/' component={Landing}/>
					<AuthenticatedRoute exact path='/app' component={Dashboard}/>
					<Route exact path='/invite' component={InvitedUserScreen}/>
                    <Route exact path='/authloader' component={AuthLoadingScreen}/>
					<Route exact path='*' component={NotFound}/>
				</Switch>
			</BrowserRouter>

		</ThemeProvider>
		
	)
}
export default App;
