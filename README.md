# modx

modx is a lightweight library to help developer use redux in a simple way

### installation

```shell script
$ npm install @olajs/modx --save
$ yarn add @olajs/modx
```

## Usage

### create model

```typescript
// moduleA.ts

import { ModelConfig } from '@olajs/modx';

export default {
  namespace: 'moduleA',
  state: {
    counter: 0,
  },
  reducers: {
    plus: (state) => ({ counter: state.counter + 1 }),
    minus: (state) => ({ counter: state.counter - 1 }),
  },
} as ModelConfig;
```

### use in global redux state

```typescript
import { createStore } from '@olajs/modx';
import modelA from './moduleA.ts';

const store = createStore({}, [modelA]);

console.log(store.getState()[modelA.namespace]);
// { counter: 0 }

store.dispatch({ type: `${modelA.namespace}/plus` });
console.log(store.getState()[modelA.namespace]);
// { counter: 1 }

store.dispatch({ type: `${modelA.namespace}/plus` });
console.log(store.getState()[modelA.namespace]);
// { counter: 2 }

store.dispatch({ type: `${modelA.namespace}/minus` });
console.log(store.getState()[modelA.namespace]);
// { counter: 1 }
```
