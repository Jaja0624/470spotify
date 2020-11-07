import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthenticatedRoute } from './containers/AuthenticatedRoute';
import { Landing } from './containers/Landing';
import Dashboard from './containers/Dashboard';
import Group from './containers/Group'
import { NotFound } from './containers/NotFound';
import userStore from './store/user'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './core/theme';
import axios from 'axios'

const App: React.FC = () => {
	const user = userStore();

	// when frontend loads, it will call the "all group" endpoint every 5s
	useEffect(() => {
        setInterval(async function() {
			// should use axios but im getting "module not found" error for axios ...
			try {
				const res = await axios.get('http://localhost:5000/api/group/all');
				console.log(res.data); // here is the group data
			
			} catch (err) {
				console.log("err");
				console.log(err)
			}
		}, 5000);
    })

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			<BrowserRouter>
				<Switch> 
					<Route exact path='/' component={Landing}/>
					<AuthenticatedRoute exact isAuthenticated={user.authenticated} path='/app' component={Dashboard}/>
					<Route exact path='/aa' component={Dashboard}/>
                    <Route exact path='/group' component={Group}/>
					<Route exact path='*' component={NotFound}/>
				</Switch>
			</BrowserRouter>

		</ThemeProvider>
		
	)
}
export default App;
