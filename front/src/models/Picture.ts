export interface Picture {
	id: number;
	filename: string;
	content: string;
	userId: number;
};

export const NoImage: Picture = {
	id: 0,
	filename: '',
	content: require('../resources/image-fill.svg'),
	userId: 0
}

export enum Directory {
	Animals = 'animals',
	Events = 'events'
}
