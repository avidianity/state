import { EventBus } from './EventBus';
import { Key } from './Key';
export declare type StorageItem = {
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
export declare type ChangeEvent<T> = (value: T) => void;
export declare class State {
    protected static instance: State;
    protected storage: AsyncStorage;
    protected key: string;
    protected bus: EventBus;
    constructor(storage: AsyncStorage, key?: string);
    setStorage(storage: AsyncStorage): Promise<this>;
    static getInstance(): State;
    clear(): Promise<this>;
    getAll(): Promise<StorageItem>;
    setAll(data: StorageItem): Promise<this>;
    has(key: string): Promise<boolean>;
    get<T = any>(key: string): Promise<T>;
    set(key: string, value: any): Promise<this>;
    remove(key: string): Promise<this>;
    dispatch<T>(key: string, value: T): this;
    listen<T>(key: string, callback: ChangeEvent<T>): Key;
    unlisten(key: Key): this;
}
export default State;
