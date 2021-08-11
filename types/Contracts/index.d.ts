export * from './Storage';
export * from './AsyncStorage';
export declare type StorageItem = {
    [key: string]: any;
};
export declare type ChangeEvent<T> = (value: T) => void;
export declare type StateOptions = {
    storage?: Storage;
    key?: string;
};
