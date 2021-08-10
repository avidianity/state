import { EventBus } from './EventBus';
import { Key } from './Key';

export type StorageItem = {
    [key: string]: any;
};

export interface AsyncStorage {
    /**
     * Returns the number of key/value pairs.
     */
    readonly length: number;
    /**
     * Removes all key/value pairs, if there are any.
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    clear(): Promise<void>;
    /**
     * Returns the current value associated with the given key, or null if the given key does not exist.
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs.
     */
    key(index: number): Promise<string | null>;
    /**
     * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    removeItem(key: string): Promise<string | null>;
    /**
     * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
     *
     * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    setItem(key: string, value: string): Promise<string | null>;
    [name: string]: any;
}

export type ChangeEvent<T> = (value: T) => void;

export class State {
    protected static instance: State;
    protected storage: AsyncStorage;
    protected key = 'avidian-async-state-key';
    protected bus: EventBus;

    constructor(storage: AsyncStorage, key?: string) {
        this.storage = storage;

        if (!State.instance) {
            State.instance = this;
        }

        this.bus = new EventBus();

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

export default State;
