import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

import * as Colors from './colors';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

class AppHeader extends Component {
	static PropTypes = {
		admin: React.PropTypes.boolean
	};

	static contextTypes = {
		router: React.PropTypes.object
	};

	style = {
		appbar: {
			position: "fixed", top: 0, zIndex: 1400
		}
	};

	render() {ß

		let title_placeholder = "Blog";
		if (this.props.admin) {
			title_placeholder = "Blog    Admin    Panel";
			this.style.appbar.background = Colors.grey700;
		} else this.style.appbar.background = "rgb(0,188,212)";

		return <AppBar showMenuIconButton={false} style={this.style.appbar} 
			title={title_placeholder} iconElementRight={<AppBarIcons router={this.context.router}/>} zDepth={0}/>;
	}
}

class AppBarIcons extends Component {

	static PropTypes = {
		router: React.PropTypes.object
	};

	style = {
		button: {
			position: "relative", paddingLeft: 16, paddingRight: 16,
			marginRight: 10, marginTop: 5,
			color: Colors.darkWhite
		}
	};

	render () {
		if (location.href.split('#')[1] == '/') {
			return (<div></div>);
		} else {
			return (<div>
				<FlatButton label="Admin" style={this.style.button} onTouchTap={()=>{
					this.props.router.push("/admin");
				}}/>
				<FlatButton label="Home" style={this.style.button} onTouchTap={()=>{
					this.props.router.push("/");
				}}/>
				<FlatButton label="Logout" 	style={this.style.button} onTouchTap={()=>{
					// $.removeCookie("user");
					this.props.router.push("/");
				}}/>
			</div>);
		}
	}
}
export default AppHeader;
