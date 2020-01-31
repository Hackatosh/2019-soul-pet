/**
 * Computes the number of full years elapsed since a given date.
 * @returns a string expressing the age
 */
export function ageFromDate(date: Date): string {
	const now = new Date();
	if (date > now)
		return 'à naître';
	const age = Math.floor((now.getTime() - date.getTime()) / 31536000000);
	if (age === 0)
		return 'moins d’un an';
	else
		return age + ' an' + (age > 1 ? 's' : '');
}

/**
 * Puts the first letter of a string in uppercase.
 */
export function titleCase(s: string): string {
	if (s.length === 0)
		return s
	return s[0].toUpperCase() + s.substr(1);
}
