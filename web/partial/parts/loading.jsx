import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper'

class Loading extends Component {
	render() {
		return (
			<Paper zDepth={4} style={this.style.paper}>
				<br /><br />
				{/* <h1 style={this.style.text}>{this.props.title}</h1> */}
				<CircularProgress
					style={this.style.progress}
					mode="indeterminate" size={150} thickness={8} />
			</Paper>
		);
	};

}
export default Loading;
