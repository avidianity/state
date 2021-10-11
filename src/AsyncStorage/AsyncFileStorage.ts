import { isNode } from 'browser-or-node';
import { readFile, writeFile } from 'fs/promises';
import { AsyncStorage, StorageItem } from '../Contracts';

export class AsyncFileStorage implements AsyncStorage {
    protected readonly path: string;
    [name: string]: any;

    get length() {
        return Object.keys(this).length;
    }

    constructor(path: string) {
        if (!isNode) {
            throw new Error('AsyncFileStorage only works in NodeJS');
        }

        this.path = path;
        this.setAll({});
    }

    protected async getAll(): Promise<StorageItem> {
        try {
            const data = JSON.parse((await readFile(this.path)).toString('utf8'));
            if (typeof data === 'object') {
                return data;
            } else {
                await writeFile(this.path, JSON.stringify({}));
                return {};
            }
        } catch (_) {
            await writeFile(this.path, JSON.stringify({}));
            return {};
        }
    }

    protected async setAll(data: StorageItem) {
        await writeFile(
            this.path,
            JSON.stringify({
                ...this.getAll(),
                ...data,
            }),
        );
        return this;
    }

    async clear() {
        await this.setAll({});

        return this;
    }

    async has(key: string) {
        const data = await this.getAll();
        return key in data;
    }

    async getItem(key: string) {
        const data = await this.getAll();
        if (!(key in data)) {
            return null;
        }

        return data[key];
    }

    async key(index: number) {
        const data = await this.getAll();
        const key = Object.keys(data)[index];

        return key || null;
    }

    async removeItem(key: string) {
        const data = await this.getAll();

        if (key in data) {
            delete data[key];
            delete this[key];

            this.setAll(data);
        }

        return this;
    }

    async setItem(key: string, value: string) {
        const data = await this.getAll();

        data[key] = value;
        this[key] = value;

        return await this.setAll(data);
    }
}
