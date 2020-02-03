/***
 * This files defines the history constant which is used through the whole application.
 * The history is mainly used with the method .push(/route), which then trigger the Router in the App.tsx component, allowing to navigate in the application.
 ***/

import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
