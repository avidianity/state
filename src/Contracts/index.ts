export * from './Storage';
export * from './AsyncStorage';

export type StorageItem = {
    [key: string]: any;
};

export type ChangeEvent<T> = (value: T) => void;

export type StateOptions = {
    storage?: Storage;
    key?: string;
};
