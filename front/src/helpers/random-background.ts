export function randomBackground(): string {
	const backgroundClasses = ['background1', 'background2', 'background3', 'background4', 'background5', 'background6', 'background7'];
	return backgroundClasses[Math.floor(Math.random() * backgroundClasses.length)];
}
