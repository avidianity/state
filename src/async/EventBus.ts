import { Key } from './Key';
import { Observer } from './Observer';

type Observers = {
	[key: string]: Observer[];
};

export class EventBus {
	protected observers: Observers = {};

	listen<T = any>(key: string, callback: (value: T) => void) {
		if (!(key in this.observers)) {
			this.observers[key] = [];
		}

		const handle = new Key(key);
		this.observers[key].unshift(new Observer(handle, callback));

		return handle;
	}

	unlisten(key: Key) {
		const name = key.getName();
		const id = key.getID();

		if (!(name in this.observers)) {
			return;
		}

		const index = this.observers[name].findIndex((observer) => observer.getKey().getID() === id);

		if (index >= 0) {
			this.observers[name].splice(index, 1);
		}
	}

	dispatch(name: string, value?: any) {
		if (!(name in this.observers)) {
			return this;
		}

		this.observers[name].forEach((observer) => observer.execute(value));
		return this;
	}
}
