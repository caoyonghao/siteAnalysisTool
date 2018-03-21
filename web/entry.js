import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <AppBar title="Site Analysis Platform" />
  </MuiThemeProvider>
);

let app = document.createElement('div');
ReactDOM.render(<App />, app);
document.body.appendChild(app);