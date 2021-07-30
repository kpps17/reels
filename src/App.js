import './App.css';
import React, { useContext } from 'react';
import Header from './Components/Header/Header';
import Feeds from './Components/Feeds/Feeds';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Signup from './Components/Signup/Signup';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import { AuthProvide, AuthContext } from './context/AuthProvider';

function App() {
	return (
		<AuthProvide>
			<Router>
				<div className="App">
					<Header />
					<Switch>
						<Route path="/login" component={Login} exact></Route>
						<Route path="/signup" component={Signup} exact></Route>
						<PrivateRoute path="/" comp={Feeds}></PrivateRoute>
						<PrivateRoute path="/profile" comp={Profile}></PrivateRoute >
					</Switch>
				</div>
			</Router>
		</AuthProvide>
	);
}

function PrivateRoute(props) {
	let { comp: Component, path } = props;
	let { currentUser } = useContext(AuthContext);
	// currentUser = true;
	return currentUser ? <Route path={path} component={Component}></Route> : <Redirect to="/login"></Redirect>;
}

export default App;