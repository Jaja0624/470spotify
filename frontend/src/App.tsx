import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import Landing from './containers/Landing';
import Dashboard from './containers/Dashboard';
import Group from './containers/Group'
import NotFound from './containers/NotFound';
import userStore from './store/user'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './core/theme';
import axios from 'axios'
import IGroup from './types/IGroup'
import AuthLoadingScreen from './containers/AuthLoadingScreen'

const App: React.FC = () => {
	const user = userStore();

	const getGroup = async ()  => {
		const res = await axios.get('/api/group/all');
		// console.log("group dataaaaaaaaaaaaaaaaaa", res.data); // here is the group data
		if (user.userGroups.length === res.data.length) {
			// assume no new data
			// TODO: Actually verify if new data exists
			// server pushes new data (TBD)
			return;
		}
		const groups: Array<IGroup> = [];
		for (let i = 0; i < res.data.length; i++) {
			let newG = {
				id: res.data[i].group_uid,
				name: res.data[i].group_name,
				img_url: undefined
			}
			groups.push(newG);
		}
		user.setUserGroups(groups);
	}
	// when frontend loads, it will call the "all group" endpoint every 5s
	useEffect(() => {
		async function scopedGetGroup() {
            await getGroup();
        }
		if (user.spotifyProfile) {
			scopedGetGroup();
		}
        setInterval(async function() {
			if (user.spotifyProfile) {
				try {
					await getGroup();
				} catch (err) {
					console.log("err");
					console.log(err)
				}
			}
		}, 5000);
    })

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			<BrowserRouter>
				<Switch> 
					<Route exact path='/' component={Landing}/>
					<AuthenticatedRoute exact path='/app' component={Dashboard}/>
					{/* <Route exact path='/aa' component={Dashboard}/> */}
                    <Route exact path='/group' component={Group}/>
                    <Route exact path='/authloader' component={AuthLoadingScreen}/>
					<Route exact path='*' component={NotFound}/>
				</Switch>
			</BrowserRouter>

		</ThemeProvider>
		
	)
}
export default App;
