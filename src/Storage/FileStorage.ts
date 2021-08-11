import { isNode } from 'browser-or-node';
import { readFileSync, writeFileSync } from 'fs';
import { Storage, StorageItem } from '../Contracts';

export class FileStorage implements Storage {
    protected readonly path: string;
    [name: string]: any;

    get length() {
        return Object.keys(this.getAll()).length;
    }

    constructor(path: string) {
        if (!isNode) {
            throw new Error('FileStorage only works in NodeJS');
        }

        this.path = path;
        this.setAll({});
    }

    protected getAll(): StorageItem {
        try {
            const data = JSON.parse(readFileSync(this.path).toString('utf8'));
            if (typeof data === 'object') {
                return data;
            } else {
                writeFileSync(this.path, JSON.stringify({}));
                return {};
            }
        } catch (_) {
            writeFileSync(this.path, JSON.stringify({}));
            return {};
        }
    }

    protected setAll(data: StorageItem) {
        writeFileSync(
            this.path,
            JSON.stringify({
                ...this.getAll(),
                ...data,
            }),
        );
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
