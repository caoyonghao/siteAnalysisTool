import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppBar, Paper, Toolbar, Typography} from 'material-ui';

import Chart from './component/Chart.jsx'
import Tabel from './component/Tabel.jsx'
import Grid from './component/Grid.jsx'
import ReactEcharts from 'echarts-for-react';
 

// render echarts option.

const App = () => (
  
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            信息分析
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid />
    </div>
);

let app = document.createElement('div');
ReactDOM.render(<App />, app);
document.body.appendChild(app);