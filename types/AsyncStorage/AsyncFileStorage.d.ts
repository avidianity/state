import { AsyncStorage, StorageItem } from '../Contracts';
export declare class AsyncFileStorage implements AsyncStorage {
    protected readonly path: string;
    [name: string]: any;
    get length(): number;
    constructor(path: string);
    protected getAll(): Promise<StorageItem>;
    protected setAll(data: StorageItem): Promise<this>;
    clear(): Promise<this>;
    has(key: string): Promise<boolean>;
    getItem(key: string): Promise<any>;
    key(index: number): Promise<string | null>;
    removeItem(key: string): Promise<this>;
    setItem(key: string, value: string): Promise<this>;
}
