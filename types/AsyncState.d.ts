import { Key, Manager } from '@avidian/events';
import { AsyncStorage, ChangeEvent, StorageItem } from './Contracts';
export declare class AsyncState {
    protected static instance: AsyncState;
    protected storage: AsyncStorage;
    protected key: string;
    protected bus: Manager;
    constructor(storage: AsyncStorage, key?: string);
    count(): Promise<number>;
    setStorage(storage: AsyncStorage): Promise<this>;
    static getInstance(storage?: AsyncStorage, key?: string): AsyncState;
    clear(): Promise<this>;
    getAll(): Promise<StorageItem>;
    setAll(data: StorageItem): Promise<this>;
    has(key: string): Promise<boolean>;
    get<T = any>(key: string): Promise<T | null>;
    set(key: string, value: any): Promise<this>;
    remove(key: string): Promise<this>;
    dispatch<T>(key: string, value: T): this;
    listen<T>(key: string, callback: ChangeEvent<T>): Key;
    unlisten(key: Key): this;
}
export default AsyncState;
