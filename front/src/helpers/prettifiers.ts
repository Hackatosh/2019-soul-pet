/**
 * Computes the number of full years elapsed since a given date.
 */
export function ageFromDate(date: Date): number {
    return Math.floor(((new Date()).getTime() - date.getTime()) / 31536000000);
}

/**
 * Puts the first letter of a string in uppercase.
 */
export function titleCase(s: string): string {
    return s[0].toUpperCase() + s.substr(1);
}
