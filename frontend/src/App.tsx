import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthenticatedRoute } from './containers/AuthenticatedRoute';
import { Landing } from './containers/Landing';
import Dashboard from './containers/Dashboard';
import { NotFound } from './containers/NotFound';
import userStore from './store/user'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './core/theme'

const App: React.FC = () => {
	const user = userStore();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			<BrowserRouter>
				<Switch> 
					<Route exact path='/' component={Landing}/>
					<AuthenticatedRoute exact isAuthenticated={user.authenticated} path='/app' component={Dashboard}/>
					<Route exact path='/aa' component={Dashboard}/>
					<Route exact path='*' component={NotFound}/>
				</Switch>
			</BrowserRouter>

		</ThemeProvider>
		
	)
}
export default App;
