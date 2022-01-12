import { Storage, StorageItem } from '../Contracts';
export declare class MemoryStorage implements Storage {
    protected data: any;
    [name: string]: any;
    id: string;
    get length(): number;
    constructor();
    protected getAll(): StorageItem;
    protected setAll(data: StorageItem): this;
    clear(): this;
    has(key: string): boolean;
    getItem(key: string): any;
    key(index: number): string | null;
    removeItem(key: string): this;
    setItem(key: string, value: string): this;
}
