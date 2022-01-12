import { Storage, StorageItem } from '../Contracts';
import { v4 } from 'uuid';

export class MemoryStorage implements Storage {
    protected data: any = {};
    [name: string]: any;

    public id = v4();

    get length() {
        return Object.keys(this.getAll()).length;
    }

    constructor() {
        this.setAll({});
    }

    protected getAll(): StorageItem {
        return this.data;
    }

    protected setAll(data: StorageItem) {
        this.data = {
            ...data,
        };
        return this;
    }

    clear() {
        this.setAll({});

        return this;
    }

    has(key: string) {
        const data = this.getAll();
        return key in data;
    }

    getItem(key: string) {
        const data = this.getAll();
        if (!(key in data)) {
            return null;
        }

        return data[key];
    }

    key(index: number) {
        const data = this.getAll();
        const key = Object.keys(data)[index];

        return key || null;
    }

    removeItem(key: string) {
        const data = this.getAll();

        if (key in data) {
            delete data[key];
            delete this[key];

            this.setAll(data);
        }

        return this;
    }

    setItem(key: string, value: string) {
        const data = this.getAll();

        data[key] = value;
        this[key] = value;

        return this.setAll(data);
    }
}
