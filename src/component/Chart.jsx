import React from 'react';
const _ = require('lodash');
const BarChart = require("react-chartjs").Bar;

class Chart extends React.Component {
    constructor(props) {
        super(props);
        const labels = [];
        const data = [];
        _.forEach(this.props.data, value => {
            labels.push(value.label);
            data.push(parseInt(value.data.length));
        });
        this.state = {
            option: { scaleShowGridLines: true },
            data: {
                labels,
                datasets: [
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data
                    }
                ]
            },
        };
    }

    render() {
        return (
            <div style={{padding: '20px 0'}}>
                <BarChart data={this.state.data} options={this.state.option} width="600" height="400" />
            </div>
        );
    }
}

export default Chart;