import React from 'react';
import ReactDOM from 'react-dom';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './index.css';
import { App } from './App';

/***
 * This file defines the "entry-point" of the application.
 * It is used to mount the React application into the HTML DOM.
 ***/

ReactDOM.render(<App />, document.getElementById('root'));
