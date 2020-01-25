export interface Picture {
	id: number;
	filename: string;
	content: string;
};

export const NoImage: Picture = {
	id: 0,
	filename: '',
	content: require('../resources/image-fill.svg'),
}

export enum Directory {
	Animals = 'animals'
}
