export async function handleResponse(response: Response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			return Promise.reject((data && data.message) || response.statusText);
		}

		return data;
	});
}