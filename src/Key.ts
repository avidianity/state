import { v4 } from 'uuid';

export class Key {
	protected id: string;
	protected name: string;

	constructor(name: string) {
		this.id = v4();
		this.name = name;
	}

	getID() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	toString() {
		return `'${this.id} - ${this.name}'`;
	}
}
