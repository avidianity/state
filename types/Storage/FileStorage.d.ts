import { Storage } from '../Contracts';
declare type Data = {
    [key: string]: string;
};
export declare class FileStorage implements Storage {
    protected readonly path: string;
    [name: string]: any;
    get length(): number;
    constructor(path: string);
    protected getAll(): Data;
    protected setAll(data: Data): this;
    clear(): this;
    has(key: string): boolean;
    getItem(key: string): string | null;
    key(index: number): string | null;
    removeItem(key: string): this;
    setItem(key: string, value: string): this;
}
export {};
