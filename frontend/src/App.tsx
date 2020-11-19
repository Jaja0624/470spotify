import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import Landing from './containers/Landing';
import Dashboard from './containers/Dashboard';
import NotFound from './containers/NotFound';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './core/theme';
import AuthLoadingScreen from './containers/AuthLoadingScreen'
import InvitedUserScreen from './containers/InvitedUserScreen'

const App: React.FC = () => {
	
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
