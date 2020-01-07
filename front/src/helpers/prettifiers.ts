/**
 * Computes the number of full years elapsed since a given date.
 */
export function ageFromDate(date: Date): number {
    const now = new Date();
    if (date > now)
        throw new Error('La date ne peut pas être dans le futur !');
    return Math.floor((now.getTime() - date.getTime()) / 31536000000);
}

/**
 * Puts the first letter of a string in uppercase.
 */
export function titleCase(s: string): string {
    if (s.length === 0)
        return s
    return s[0].toUpperCase() + s.substr(1);
}
