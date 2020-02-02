import { User } from "../models";
import React from "react";
import { Link } from "react-router-dom";

export interface UserBadgeProps {
	user: User;
}

/**
 * Component which displays a small badge with a user's username and a link to
 * their profile page
 */
export class UserBadge extends React.Component<UserBadgeProps> {
	render() {
		return (<Link to={`/profile/${this.props.user.id}`} className="badge badge-primary" style={{ fontSize: '100%' }}>{this.props.user.username}</Link>)
	}
}
