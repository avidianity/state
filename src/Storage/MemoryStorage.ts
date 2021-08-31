import { Storage, StorageItem } from '../Contracts';

export class MemoryStorage implements Storage {
    protected readonly path: string;
    protected data: any = {};
    [name: string]: any;

    get length() {
        return Object.keys(this.getAll()).length;
    }

    constructor(path: string) {
        this.path = path;
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
