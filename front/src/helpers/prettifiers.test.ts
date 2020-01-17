import { ageFromDate, titleCase } from "./prettifiers";

test('ageFromDate', () => {
    let d = new Date();
    expect(ageFromDate(d)).toBe(0);
    d.setFullYear(d.getFullYear() - 1);
    expect(ageFromDate(d)).toBe(1);
    d.setFullYear(d.getFullYear() + 2);
    expect(() => ageFromDate(d)).toThrow();
});

test('titleCase', () => {
    expect(titleCase('')).toBe('');
    expect(titleCase('aa')).toBe('Aa');
    expect(titleCase('AA')).toBe('AA');
})
