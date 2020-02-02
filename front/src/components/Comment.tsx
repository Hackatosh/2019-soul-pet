import { EventComment } from "../models";
import React from "react";
import './Comment.css';
import { Link } from "react-router-dom";

export interface CommentProps {
	comment: EventComment;
}
/**
 * Comonent which displays a comment with eventually the username of the writer
 */
export class Comment extends React.Component<CommentProps> {
	render() {
		return (
			<div className="px-3 border-left border-primary">
				<p className="line-breaks">{this.props.comment.text}</p>
				<p className="text-right text-muted">
					{this.props.comment.user !== undefined ? (
					<Link to={`/profile/${this.props.comment.user.id}`} className="badge badge-primary" style={{ fontSize: '100%' }}>
						{this.props.comment.user.username}
					</Link>
					) : (
					<span>Utilisateur inconnu</span>
					)}
					&nbsp;— {this.props.comment.createdAt.toLocaleDateString()} à {this.props.comment.createdAt.getHours()}&nbsp;h&nbsp;{this.props.comment.createdAt.getMinutes()}
				</p>
			</div>)
	}
}
