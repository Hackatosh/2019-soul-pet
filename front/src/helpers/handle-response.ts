export async function handleResponse(response: Response): Promise<any> {
    if (!response.ok)
        return Promise.reject(response.text() || response.statusText);
	return response.json();
}
