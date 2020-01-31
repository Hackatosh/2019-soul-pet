import { User } from "../models";
import React from "react";
import { Link } from "react-router-dom";

export interface UserBadgeProps {
	user: User;
}

export class UserBadge extends React.Component<UserBadgeProps> {
	render() {
		return (<Link to={`/profile/${this.props.user.id}`} className="badge badge-primary" style={{ fontSize: '100%' }}>{this.props.user.username}</Link>)
	}
}
