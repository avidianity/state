import { AsyncStorage, StorageItem } from '../Contracts';
export declare class AsyncMemoryStorage implements AsyncStorage {
    protected data: any;
    [name: string]: any;
    get length(): number;
    constructor();
    protected getAll(): StorageItem;
    protected setAll(data: StorageItem): this;
    clear(): Promise<this>;
    has(key: string): boolean;
    getItem(key: string): any;
    key(index: number): Promise<string | null>;
    removeItem(key: string): Promise<this>;
    setItem(key: string, value: string): Promise<this>;
}
