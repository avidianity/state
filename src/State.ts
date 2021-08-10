import { EventBus } from './EventBus';
import { Key } from './Key';

export type StorageItem = {
    [key: string]: any;
};

export type ChangeEvent<T> = (value: T) => void;

export class State {
    protected static instance = new State();
    protected storage: Storage;
    protected key = 'avidian-state-key';
    protected bus: EventBus;

    constructor(keyOrStorage?: string | Storage) {
        if (keyOrStorage && keyOrStorage instanceof Storage) {
            this.storage = keyOrStorage;
        } else {
            this.storage = window?.localStorage;
        }

        this.bus = new EventBus();
        if (keyOrStorage && typeof keyOrStorage === 'string') {
            this.key = keyOrStorage;
        }
        const data = this.getAll();
        this.setAll({ ...data });
    }

    setStorage(storage: Storage) {
        storage.setItem(this.key, this.storage.getItem(this.key) || JSON.stringify({}));

        return this;
    }

    static getInstance() {
        return this.instance;
    }

    clear() {
        return this.setAll({});
    }

    getAll(): StorageItem {
        try {
            const data = this.storage.getItem(this.key);
            return data ? JSON.parse(data) : {};
        } catch (_) {
            return {};
        }
    }

    setAll(data: StorageItem) {
        this.storage.setItem(this.key, JSON.stringify(data));
        return this;
    }

    has(key: string) {
        return key in this.getAll();
    }

    get<T = any>(key: string): T {
        return this.getAll()[key];
    }

    set(key: string, value: any) {
        const data = this.getAll();
        data[key] = value;
        this.dispatch(key, value);
        return this.setAll(data);
    }

    remove(key: string) {
        if (this.has(key)) {
            const data = this.getAll();
            delete data[key];
            this.setAll(data);
        }
        return this;
    }

    dispatch<T>(key: string, value: T) {
        this.bus.dispatch(key, value);
        return this;
    }

    listen<T>(key: string, callback: ChangeEvent<T>) {
        return this.bus.listen(key, callback);
    }

    unlisten(key: Key) {
        this.bus.unlisten(key);
        return this;
    }
}

export default State;
