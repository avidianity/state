import { isNode } from 'browser-or-node';
import { RedisClient, ClientOpts } from 'redis';
import { AsyncStorage, StorageItem } from '../Contracts';

export type RedisStorageOptions = ClientOpts & { key?: string };

export class RedisStorage implements AsyncStorage {
    length: number;
    [name: string]: any;
    protected name: string;
    protected client: RedisClient;

    constructor(options?: RedisStorageOptions) {
        if (!isNode) {
            throw new Error('RedisStorage only works in NodeJS');
        }

        this.name = options?.key || 'avidian-state-redis-key';
        this.length = 0;

        this.client = new RedisClient(options || {});

        this.setAll({});
    }

    init() {
        return new Promise<this>((resolve, reject) => {
            this.client.on('connect', () => resolve(this));
            this.client.on('error', (error) => reject(error));
        });
    }

    stop() {
        return new Promise<void>((resolve, reject) => {
            this.client.quit((error) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }

    protected getAll() {
        return new Promise<StorageItem>((resolve, reject) => {
            this.client.get(this.name, (error, raw) => {
                if (error) {
                    return reject(error);
                }

                if (!raw) {
                    return resolve({});
                }

                try {
                    const data = JSON.parse(raw);

                    if (typeof data !== 'object') {
                        return resolve({});
                    }

                    return resolve(data);
                } catch (_) {
                    return resolve({});
                }
            });
        });
    }

    protected setAll(data: StorageItem) {
        return new Promise<this>(async (resolve, reject) => {
            try {
                const previous = await this.getAll();
                const payload = {
                    ...previous,
                    ...data,
                };

                this.client.set(this.name, JSON.stringify(payload), (error) => {
                    if (error) {
                        return reject(error);
                    }

                    this.length = Object.keys(payload).length;

                    resolve(this);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async clear() {
        await this.setAll({});

        return this;
    }

    async getItem(key: string) {
        const data = await this.getAll();

        if (!(key in data)) {
            return null;
        }

        return data[key];
    }

    async key(index: number) {
        const keys = Object.keys(await this.getAll());

        const key = keys[index];

        if (!key) {
            return null;
        }

        return key;
    }

    async removeItem(key: string) {
        const data = await this.getAll();

        if (key in data) {
            delete data[key];
            delete this[key];

            await this.setAll(data);
        }

        return this;
    }

    async setItem(key: string, value: string) {
        const data = await this.getAll();

        data[key] = value;

        return await this.setAll(data);
    }
}
