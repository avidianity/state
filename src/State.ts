import { Manager, Key } from '@avidian/events';
import { isNode } from 'browser-or-node';
import { ChangeEvent, StateOptions, StorageItem, Storage } from './Contracts';

export class State {
    protected static instance: State;
    protected storage: Storage = null as any;
    protected key = '';
    protected bus: Manager;

    constructor(options?: StateOptions | Storage | string) {
        let key = '';
        if (!isNode && window?.localStorage) {
            this.storage = window.localStorage;
        } else if (options && typeof options === 'string') {
            key = options;
        } else if (options && typeof options === 'object') {
            const opt: any = options;
            if (opt.getItem) {
                this.storage = opt;
            } else {
                if (opt.key) {
                    key = opt.key;
                }
                if (opt.storage) {
                    this.storage = opt.storage;
                }
            }
        }

        if (!this.storage) {
            throw new Error('No Storage provided');
        }

        if (key.length === 0) {
            this.key = 'avidian-state-key';
        } else {
            this.key = key;
        }

        if (!State.instance) {
            State.instance = this;
        }

        this.bus = new Manager();
        const data = this.getAll();
        this.setAll({ ...data });
    }

    count() {
        return Object.keys(this.getAll()).length;
    }

    getStorage() {
        return this.storage;
    }

    setStorage(storage: Storage) {
        storage.setItem(this.key, this.storage.getItem(this.key) || JSON.stringify({}));

        this.storage = storage;

        return this;
    }

    static getInstance(options?: StateOptions | Storage | string) {
        if (this.instance instanceof this === false) {
            this.instance = new this(options);
        }
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

    get<T = any>(key: string): T | null {
        const value = this.getAll()[key];

        if (value === undefined) {
            return null;
        }

        return value;
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
