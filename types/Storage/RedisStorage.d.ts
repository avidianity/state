import { RedisClient, ClientOpts } from 'redis';
import { AsyncStorage, StorageItem } from '../Contracts';
export declare type RedisStorageOptions = ClientOpts & {
    key?: string;
};
export declare class RedisStorage implements AsyncStorage {
    length: number;
    [name: string]: any;
    protected name: string;
    protected client: RedisClient;
    constructor(options?: RedisStorageOptions);
    init(): Promise<this>;
    stop(): Promise<void>;
    protected getAll(): Promise<StorageItem>;
    protected setAll(data: StorageItem): Promise<this>;
    clear(): Promise<this>;
    getItem(key: string): Promise<any>;
    key(index: number): Promise<string | null>;
    removeItem(key: string): Promise<this>;
    setItem(key: string, value: string): Promise<this>;
}
