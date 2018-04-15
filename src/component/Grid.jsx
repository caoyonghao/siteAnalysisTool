import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { Grid } from 'material-ui';

import Chart from './Chart.jsx'
import Tabel from './Tabel.jsx'

const _ = require('lodash');

const dataAnalysis = () => {
    // const data = require('./../../result/bbs-sorted.json');
    const dataByMonth = require('./../../result/bbs-since2017-month.json');
    
    // const dataSince2017 = _.filter(data, o => o.time.startsWith('2017') || o.time.startsWith('2018'));
    // console.log(dataSince2017)
    // for (let i = 1; i < 13; i++) {
    //     let tmp = i;
    //     if (i < 10) tmp = '0' + i;
    //     dataByMonth.push({label: `2017-${tmp}`, data: _.filter(dataSince2017, o => o.time.startsWith(`2017-${tmp}`))});
    // }
    // for (let j = 1; j < 4; j++) {
    //     dataByMonth.push({label: `2018-0${j}`, data: _.filter(dataSince2017, o => o.time.startsWith(`2017-0${j}`))});
    // }

    return dataByMonth;
}
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function FullWidthGrid(props) {
  const { classes } = props;
  const data = dataAnalysis();
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Chart data={data}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tabel />
        </Grid>
      </Grid>
    </div>
  );
}

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);