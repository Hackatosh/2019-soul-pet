import { authenticationService } from '../services';

export async function handleResponse(response: Response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if ([401, 403].indexOf(response.status) !== -1) {
				authenticationService.logout();
				window.location.reload();
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}