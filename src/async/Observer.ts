import { Key } from './Key';

export class Observer {
	protected key: Key;
	protected callback: Function;

	constructor(key: Key, callback: Function) {
		this.key = key;
		this.callback = callback;
	}

	execute(value: any) {
		this.callback(value);
	}

	getKey() {
		return this.key;
	}
}
