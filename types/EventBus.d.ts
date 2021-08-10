import { Key } from './Key';
import { Observer } from './Observer';
declare type Observers = {
    [key: string]: Observer[];
};
export declare class EventBus {
    protected observers: Observers;
    listen<T = any>(key: string, callback: (value: T) => void): Key;
    unlisten(key: Key): void;
    dispatch(name: string, value?: any): this;
}
export {};
