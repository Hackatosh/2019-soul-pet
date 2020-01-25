import React from 'react';
import { ServicesMap } from '../components';
import './ServicesPage.css';

class ServicesPage extends React.Component<{}> {
  	render() {
		const data = {
			lat: 48.864716,
			lon: 2.349014,
			zoom : 14,
			size : "500px"
	  	};

		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-10 offset-1">
						<h1 className="text-center display-4">De quels services avez-vous besoin&nbsp;?</h1>
					</div>
				</div>
				<ServicesMap {...data}/>
			</div>
		);
  	}
}

export { ServicesPage };
