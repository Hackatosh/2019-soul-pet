import { EventComment, User } from "../models";
import React from "react";
import './Comment.css';
import { Link } from "react-router-dom";

export interface CommentProps {
	comment: EventComment;
}

export interface CommentState {
	user: User;
}

export class Comment extends React.Component<CommentProps, CommentState> {
	constructor(props: CommentProps) {
		super(props);
		this.state = { user: {} as User };
	}

	componentDidMount() {
		// TODO: Retrieve the user
	}

	render() {
		return (
			<div className="px-3">
				<p>{this.props.comment.text}</p>
				<p className="text-right text-muted">
					{this.state.user.username !== undefined ? (
					<Link to={`/profile/${this.state.user.id}`} className="badge badge-primary" style={{ fontSize: '100%' }}>
						{this.state.user.username}
					</Link>
					) : (
					<span>Utilisateur inconnu</span>
					)}
					&nbsp;— {this.props.comment.createdAt.toLocaleDateString()} à {this.props.comment.createdAt.getHours()}&nbsp;h&nbsp;{this.props.comment.createdAt.getMinutes()}
				</p>
			</div>)
	}
}
