import { Key } from './Key';
export declare class Observer {
    protected key: Key;
    protected callback: Function;
    constructor(key: Key, callback: Function);
    execute(value: any): void;
    getKey(): Key;
}
