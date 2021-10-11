import { AsyncState, AsyncMemoryStorage } from '../src';

beforeEach(() => {
    AsyncState.prototype.getAll = jest.fn(AsyncState.prototype.getAll);
    AsyncState.prototype.setAll = jest.fn(AsyncState.prototype.setAll);
    AsyncState.prototype.set = jest.fn(AsyncState.prototype.set);
    AsyncState.prototype.remove = jest.fn(AsyncState.prototype.remove);
    AsyncState.prototype.get = jest.fn(AsyncState.prototype.get);
    AsyncState.prototype.clear = jest.fn(AsyncState.prototype.clear);
    AsyncState.prototype.listen = jest.fn(AsyncState.prototype.listen);
    AsyncState.prototype.unlisten = jest.fn(AsyncState.prototype.unlisten);
    AsyncState.prototype.dispatch = jest.fn(AsyncState.prototype.dispatch);
});

describe('tests sync state', () => {
    it('creates a new state instance', () => {
        const state = new AsyncState(new AsyncMemoryStorage());

        expect(state).toBeInstanceOf(AsyncState);
    });

    it('sets a value', async () => {
        const state = new AsyncState(new AsyncMemoryStorage());

        await state.set('key', 'value');

        expect(await state.get('key')).toBe('value');
    });

    it('removes a value', async () => {
        const state = new AsyncState(new AsyncMemoryStorage());
        state.setStorage(new AsyncMemoryStorage());

        await state.set('key', 'value');
        await state.remove('key');

        expect(state.remove).toBeCalledTimes(1);
        expect(await state.get('key')).toBeNull();
    });

    it('creates a new instance with custom options', async () => {
        const state = new AsyncState(new AsyncMemoryStorage(), 'key');

        expect(state).toBeInstanceOf(AsyncState);
    });

    it('clears the contents of a storage', async () => {
        const storage = new AsyncMemoryStorage();
        await storage.setItem('key', 'value');
        await storage.setItem('foo', 'baz');

        const state = new AsyncState(storage);

        await state.clear();

        expect(state.clear).toBeCalledTimes(1);
        expect(await state.count()).toBeLessThanOrEqual(0);
    });

    it('returns a singleton', () => {
        new AsyncState(new AsyncMemoryStorage());

        expect(AsyncState.getInstance()).toBeInstanceOf(AsyncState);
    });

    it('returns a newly constructed singleton', () => {
        (AsyncState as any).instance = null;
        const state = AsyncState.getInstance(new AsyncMemoryStorage());

        expect(state).toBeInstanceOf(AsyncState);
    });

    it('returns an empty object from a faulty storage', async () => {
        const storage = new AsyncMemoryStorage();

        storage.getItem = jest.fn(storage.getItem).mockImplementation(async () => {
            throw new Error();
        });

        const state = new AsyncState(storage);

        expect(await state.count()).toBeLessThanOrEqual(0);
        expect(storage.getItem).toBeCalledTimes(1);
    });

    it('dispatches events', async () => {
        const state = new AsyncState(new AsyncMemoryStorage());

        const key = state.listen('key', (value) => {
            expect(value).toBe('value');
        });

        await state.set('key', 'value');

        expect(state.dispatch).toBeCalledTimes(1);

        state.unlisten(key);

        await state.set('key', 'anotha-value');
    });
});
