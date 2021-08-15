import { Key, Manager } from '@avidian/events';
import { AsyncStorage, ChangeEvent, StorageItem } from './Contracts';

export class AsyncState {
    protected static instance: AsyncState;
    protected storage: AsyncStorage;
    protected key = 'avidian-async-state-key';
    protected bus: Manager;

    constructor(storage: AsyncStorage, key?: string) {
        this.storage = storage;

        if (!AsyncState.instance) {
            AsyncState.instance = this;
        }

        this.bus = new Manager();

        if (key) {
            this.key = key;
        }
    }

    async setStorage(storage: AsyncStorage) {
        const item = await this.storage.getItem(this.key);
        await storage.setItem(this.key, item || JSON.stringify({}));

        this.storage = storage;

        return this;
    }

    static getInstance() {
        return this.instance;
    }

    clear() {
        return this.setAll({});
    }

    async getAll(): Promise<StorageItem> {
        const data = await this.storage.getItem(this.key);
        return data ? JSON.parse(data) : {};
    }

    async setAll(data: StorageItem) {
        await this.storage.setItem(this.key, JSON.stringify(data));
        return this;
    }

    async has(key: string) {
        const data = await this.getAll();
        return key in data;
    }

    async get<T = any>(key: string): Promise<T> {
        const data = await this.getAll();
        return data[key];
    }

    async set(key: string, value: any) {
        const data = await this.getAll();
        data[key] = value;
        this.dispatch(key, value);
        return await this.setAll(data);
    }

    async remove(key: string) {
        if (await this.has(key)) {
            const data = await this.getAll();
            delete data[key];
            await this.setAll(data);
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

export default AsyncState;
