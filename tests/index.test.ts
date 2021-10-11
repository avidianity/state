import State, { MemoryStorage } from '../src';

beforeEach(() => {
    State.prototype.set = jest.fn(State.prototype.set);
    State.prototype.setAll = jest.fn(State.prototype.setAll);
});

describe('tests sync state', () => {
    it('creates a new state instance', () => {
        const state = new State(new MemoryStorage());

        expect(state).toBeInstanceOf(State);
    });

    it('sets a value', () => {
        const state = new State(new MemoryStorage());

        state.set('key', 'value');

        expect(state.set).toBeCalledTimes(1);
        expect(state.setAll).toBeCalledTimes(2);
    });
});
