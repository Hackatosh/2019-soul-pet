export class Event {
	id: number;
	title: string;
	begin_date: string;
	end_date: string;

	constructor(id: number, title: string, begin_date: string, end_date: string) {
		this.id = id;
		this.title = title;
		this.begin_date = begin_date;
		this.end_date = end_date;
	}
}
