# @avidianity/state

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

Library for handling state in LocalStorage or AsyncStorage

## Installation

npm:

```bash
npm install @avidian/state
```

yarn:

```bash
yarn add @avidian/state
```

## Usage

`State` and `AsyncState` are storage-agnostic so that providing custom storage drivers can be supported.

### Synchonous Storage

```javascript
import State from '@avidian/state';

const state = new State(); // defaults to window.localStorage if in browser

// add values
state.set('string', 'value');
state.set('array', []);
state.set('object', {});

// removing values
state.remove('string');
state.remove('array');
state.remove('object');

// remove all values
state.remove();
```

Specifying the storage is also supported

```javascript
// use sessionStorage instead
const state = new State(window.sessionStorage, ?key);
```

Or implement your own synchonous storage

Example (typescript)

```typescript
import State, { Storage } from '@avidian/state';

class CustomStorage implements Storage {
    readonly length: number;
    
    clear(): void;
    
    getItem(key: string): string | null;
    
    key(index: number): string | null;
    
    removeItem(key: string): void;
    
    setItem(key: string, value: string): void;
}

const state = new State(new CustomStorage());
```

### Asynchronous Storage

Asynchronous state is also supported provided that you implement the `AsyncStorage` interface.
The API is also the state just like with `State` except that it returns promises.

Example (typescript)

```typescript
import AsyncState, { AsyncStorage } from '@avidian/state';

class CustomAsyncStorage implements AsyncStorage {
    readonly length: number;
    
    clear(): Promise<this>;
    
    getItem(key: string): Promise<string | null>;
    
    key(index: number): Promise<string | null>;
    
    removeItem(key: string): Promise<this>;
    
    setItem(key: string, value: string): Promise<this>;
}

const state = new AsyncState(new CustomAsyncStorage());

await state.set('key', value);
await state.remove('key');
await state.clear();
```

### Usage in Node

Both `State` and `AsyncState` will work on the `Node` enviroment as long as a custom storage implementing their respective interface is provided.

### Events

Each individual state has their own event handlers.
Both `State` and `AsyncState` work the same.

```typescript
import State from '@avidian/state';

const state = new State();

const key = state.listen('key', value => {
    // called everytime `state.set('key', value)` or `state.dispatch('key', value) is called
    console.log(value);
});

state.set('key', 'value');

// unregister the event listener
state.unlisten(key);

// dispatch your own value
state.dispatch('key', 'value');
```

### Drivers

Some drivers are provided out of the box.

#### Synchronous Drivers

##### MemoryStorage

```typescript
import State, { MemoryStorage } from '@avidian/state';

const state = new State(new MemoryStorage());
```

##### FileStorage (Node only)

```typescript
import State, { FileStorage } from '@avidian/state';

const state = new State(new FileStorage());
```

#### Asynchronous Drivers

##### AsyncFileStorage (Node only)

```typescript
import AsyncState, { AsyncFileStorage } from '@avidian/state';

const state = new AsyncState(new AsyncFileStorage());
```
