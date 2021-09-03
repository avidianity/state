import { Manager, Key } from '@avidian/events';
import { isNode } from 'browser-or-node';
import { ChangeEvent, StateOptions, StorageItem, Storage } from './Contracts';

export class State {
    protected static instance: State;
    protected storage: Storage = null as any;
    protected key = '';
    protected bus: Manager;

    constructor(options?: StateOptions | Storage | string) {
        if (!isNode && window?.localStorage) {
            this.storage = window.localStorage;
        } else if (options && typeof options === 'string') {
            this.key = options;
        } else if (options && typeof options === 'object') {
            const opt: any = options;
            if (opt.getItem) {
                this.storage = opt;
            } else {
                if (opt.key) {
                    this.key = opt.key;
                }
                if (opt.storage) {
                    this.storage = opt.storage;
                }
            }
        }

        if (!this.storage) {
            throw new Error('No Storage provided');
        }

        if (this.key.length === 0) {
            this.key = 'avidian-state-key';
        }

        if (!State.instance) {
            State.instance = this;
        }

        this.bus = new Manager();
        const data = this.getAll();
        this.setAll({ ...data });
    }

    setStorage(storage: Storage) {
        storage.setItem(this.key, this.storage.getItem(this.key) || JSON.stringify({}));

        return this;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
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
