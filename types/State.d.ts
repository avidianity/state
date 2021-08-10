import { EventBus } from './EventBus';
import { Key } from './Key';
export declare type StorageItem = {
    [key: string]: any;
};
export declare type ChangeEvent<T> = (value: T) => void;
export declare class State {
    protected static instance: State;
    protected storage: Storage;
    protected key: string;
    protected bus: EventBus;
    constructor(keyOrStorage?: string | Storage);
    setStorage(storage: Storage): this;
    static getInstance(): State;
    clear(): this;
    getAll(): StorageItem;
    setAll(data: StorageItem): this;
    has(key: string): boolean;
    get<T = any>(key: string): T;
    set(key: string, value: any): this;
    remove(key: string): this;
    dispatch<T>(key: string, value: T): this;
    listen<T>(key: string, callback: ChangeEvent<T>): Key;
    unlisten(key: Key): this;
}
export default State;