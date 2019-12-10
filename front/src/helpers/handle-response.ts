/**
 * Handles an HTTP response depending on its status.
 * @param response the Response to handle
 * @returns A Promise containing the parsed JSON of the body
 */
export async function handleResponse(response: Response): Promise<any> {
    if (!response.ok)
        return Promise.reject(response.text() || response.statusText);
	return response.json();
}
