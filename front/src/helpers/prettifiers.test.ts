import { ageFromDate, titleCase } from "./prettifiers";

test('ageFromDate', () => {
	let d = new Date();
	expect(ageFromDate(d)).toBe('moins d’un an');
	d.setFullYear(d.getFullYear() - 1);
	expect(ageFromDate(d)).toBe('1 an');
	d.setFullYear(d.getFullYear() + 2);
	expect(() => ageFromDate(d)).not.toThrow();
});

test('titleCase', () => {
	expect(titleCase('')).toBe('');
	expect(titleCase('aa')).toBe('Aa');
	expect(titleCase('AA')).toBe('AA');
})
