import { MemoryStorage, State } from '../src';

it('tests switching of storages', () => {
    const storage1 = new MemoryStorage();
    const storage2 = new MemoryStorage();

    new State(storage1).set('type', 'one');
    new State(storage2).set('type', 'two');

    const state = new State(storage1);

    state.setStorage(storage2);

    expect(state.getStorage().id).toBe(storage2.id);
    expect(state.getStorage().id === storage1.id).toBeFalsy();
});
