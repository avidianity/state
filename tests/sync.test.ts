import State, { MemoryStorage } from '../src';

beforeEach(() => {
    State.prototype.getAll = jest.fn(State.prototype.getAll);
    State.prototype.setAll = jest.fn(State.prototype.setAll);
    State.prototype.set = jest.fn(State.prototype.set);
    State.prototype.remove = jest.fn(State.prototype.remove);
    State.prototype.get = jest.fn(State.prototype.get);
    State.prototype.clear = jest.fn(State.prototype.clear);
    State.prototype.listen = jest.fn(State.prototype.listen);
    State.prototype.unlisten = jest.fn(State.prototype.unlisten);
    State.prototype.dispatch = jest.fn(State.prototype.dispatch);
});

describe('tests sync state', () => {
    it('creates a new state instance', () => {
        const state = new State(new MemoryStorage());

        expect(state).toBeInstanceOf(State);
        expect(state.setAll).toBeCalledTimes(1);
        expect(state.getAll).toBeCalledTimes(1);
    });

    it('sets a value', () => {
        const state = new State(new MemoryStorage());

        state.set('key', 'value');

        expect(state.set).toBeCalledTimes(1);
        expect(state.setAll).toBeCalledTimes(2);
        expect(state.get('key')).toBe('value');
    });

    it('removes a value', () => {
        const state = new State(new MemoryStorage());
        state.setStorage(new MemoryStorage());

        state.set('key', 'value');
        state.remove('key');

        expect(state.remove).toBeCalledTimes(1);
        expect(state.get('key')).toBeNull();
    });

    it('creates a new instance with custom options', () => {
        const state = new State({
            key: 'key',
            storage: new MemoryStorage(),
        });

        expect(state).toBeInstanceOf(State);
        expect(state.setAll).toBeCalledTimes(1);
        expect(state.getAll).toBeCalledTimes(1);
    });

    it('throws error when no storage is provided', () => {
        try {
            new State();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('clears the contents of a storage', () => {
        const storage = new MemoryStorage();
        storage.setItem('key', 'value');
        storage.setItem('foo', 'baz');

        const state = new State(storage);

        state.clear();

        expect(state.clear).toBeCalledTimes(1);
        expect(state.count()).toBeLessThanOrEqual(0);
    });

    it('returns a singleton', () => {
        new State(new MemoryStorage());

        expect(State.getInstance()).toBeInstanceOf(State);
    });

    it('returns a newly constructed singleton', () => {
        (State as any).instance = null;
        const state = State.getInstance({ storage: new MemoryStorage() });

        expect(state).toBeInstanceOf(State);
        expect(state.setAll).toBeCalledTimes(1);
        expect(state.getAll).toBeCalledTimes(1);
    });

    it('returns an empty object from a faulty storage', () => {
        const storage = new MemoryStorage();

        storage.getItem = jest.fn(storage.getItem).mockImplementation(() => {
            throw new Error();
        });

        const state = new State(storage);

        expect(state.count()).toBeLessThanOrEqual(0);
        expect(storage.getItem).toBeCalledTimes(2);
    });

    it('dispatches events', () => {
        const state = new State(new MemoryStorage());

        const key = state.listen('key', (value) => {
            expect(value).toBe('value');
        });

        state.set('key', 'value');

        expect(state.dispatch).toBeCalledTimes(1);

        state.unlisten(key);

        state.set('key', 'anotha-value');
    });
});
