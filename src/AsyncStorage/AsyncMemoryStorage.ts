import { AsyncStorage, StorageItem } from '../Contracts';

export class AsyncMemoryStorage implements AsyncStorage {
    protected data: any = {};
    [name: string]: any;

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

    async clear() {
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

    async key(index: number) {
        const data = this.getAll();
        const key = Object.keys(data)[index];

        return key || null;
    }

    async removeItem(key: string) {
        const data = this.getAll();

        if (key in data) {
            delete data[key];
            delete this[key];

            this.setAll(data);
        }

        return this;
    }

    async setItem(key: string, value: string) {
        const data = this.getAll();

        data[key] = value;
        this[key] = value;

        return this.setAll(data);
    }
}
