/***
 * This file imports all the environment variables needed for the front-end from process.env.
 * It then export them through the config object.
 ***/

export const config = {
	apiUrl: process.env.REACT_APP_BACK_URL as string
};
