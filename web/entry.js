// import React from 'react';
// import ReactDOM from 'react-dom';
// import {Router, hashHistory} from 'react-router';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import AppBar from 'material-ui/AppBar';

// const App = () => (
//   <MuiThemeProvider muiTheme={getMuiTheme()}>
//     <AppBar title="Site Analysis Platform" />
//   </MuiThemeProvider>
// );

// let app = document.createElement('div');
// ReactDOM.render(<App />, app);
// document.body.appendChild(app);
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import AppRoutes from './router.jsx';


// import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
	<Router
		history={hashHistory}
		onUpdate={() => window.scrollTo(0, 0)}
	>
		{AppRoutes}
	</Router>,
document.getElementById('app'));