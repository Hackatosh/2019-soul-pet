import React from 'react';
import { ServicesMap } from '../components';
import './ServicesPage.css';

/**
 * Page which displays services near the user. It mostly uses the `ServicesMap`
 component which embeds a map and tools to interact with it.
 */
export class ServicesPage extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-10 offset-1">
						<h1 className="text-center display-4">De quels services avez-vous besoin&nbsp;?</h1>
					</div>
				</div>
				<ServicesMap lat={48.864716} lon={2.349014} zoom={14} />
			</div>
		);
  	}
}
