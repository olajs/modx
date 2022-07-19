# modx

Modx is a lightweight library to help developer use redux in a simple way.

Just create a `model`, you can use it in `global redux state`,
`Class Component` and `Function Component` , also easy to write
`Unit Test` for `model` with `jest`.

### Installation

```shell script
$ npm install @olajs/modx --save
$ yarn add @olajs/modx
```

## Usage

- [Create model](#create-model)
- [Simple use](#simple-use)
- [Using in React with react-redux](#using-in-react-with-react-redux)
- [Using in Class Component](#using-in-class-component)
- [Using in Function Component](#using-in-function-component)
- [Using async logic](#using-async-logic)
- [useModel & withModel](#usemodel--withmodel)

### Create model

```typescript
// modelA.ts

import { createModel } from '@olajs/modx';
export default createModel({
  namespace: 'modelA',
  state: {
    counter: 0,
  },
  reducers: {
    plus: (state) => ({ counter: state.counter + 1 }),
    minus: (state) => ({ counter: state.counter - 1 }),
  },
});
```

### Simple use

```typescript
// store.ts

import { createStore } from '@olajs/modx';
import modelA from './modelA';

const store = createStore({}, [modelA]);
const { namespace } = modelA;

console.log(store.getState()[namespace]);
// { counter: 0 }

store.dispatch({ type: `${namespace}/plus` });
console.log(store.getState()[namespace]);
// { counter: 1 }

store.dispatch({ type: `${namespace}/plus` });
console.log(store.getState()[namespace]);
// { counter: 2 }

store.dispatch({ type: `${namespace}/minus` });
console.log(store.getState()[namespace]);
// { counter: 1 }
```

### Using in React with react-redux

```typescript jsx
// App.tsx

import React from 'react';
import { useGlobalModel } from '@olajs/modx';
import modelA from './modelA';

function App() {
  const { state, dispatchers } = useGlobalModel(modelA);
  return (
    <div>
      {state.counter}
      <br />
      <button onClick={() => dispatchers.plus()}>plus</button>
      <br />
      <button onClick={() => dispatchers.minus()}>minus</button>
    </div>
  );
}

export default App;
```

```typescript jsx
// main.tsx

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from '@olajs/modx';
import modelA from './modelA';
import App from './App';

const store = createStore({}, [modelA], { devTools: true });

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementByid('app'),
);
```

### Using in Class Component

```typescript jsx
// withSingleModel.tsx

import React from 'react';
import { withSingleModel, UseModelResult } from '@olajs/modx';
import modelA from './modelA';

type Props = UseModelResult<typeof modelA>;

class WithSingleModel extends React.PureComponent<Props, any> {
  render() {
    const { state, dispatchers } = this.props.singleModel;

    return (
      <div>
        {state.counter}
        <br />
        <button onClick={dispatchers.plus}>plus</button>
        <br />
        <button onClick={dispatchers.minus}>minus</button>
      </div>
    );
  }
}

export default withSingleModel(modelA)(WithSingleModel);
```

### Using in Function Component

```typescript jsx
// useSingleModel.tsx

import React from 'react';
import { useSingleModel } from '@olajs/modx';
import modelA from './modelA';

function UseSingleModel() {
  const { state, dispatchers } = useSingleModel(modelA);

  return (
    <div>
      {state.counter}
      <br />
      <button onClick={() => dispatchers.plus()}>plus</button>
      <br />
      <button onClick={() => dispatchers.minus()}>minus</button>
    </div>
  );
}

export default UseSingleModel;
```

### Using async logic

```typescript jsx
// modelB.ts

import { createModel } from '@olajs/modx';

export default createModel({
  namespace: 'modelB',
  state: {
    counter: 0,
  },
  reducers: {
    plus: (state) => ({ counter: state.counter + 1 }),
    minus: (state) => ({ counter: state.counter - 1 }),
  },
  effects: {
    plusAsync(timeout: number) {
      const { prevState } = this;
      console.log(prevState); // { counter: xxx }
      setTimeout(() => {
        this.plus();
      }, timeout);
    },
    minusAsync(timeout: number) {
      const { prevState } = this;
      console.log(prevState); // { counter: xxx }
      setTimeout(() => {
        this.minus();
      }, timeout);
    },
  },
});
```

```typescript jsx
// useSingleModelB.tsx

import React from 'react';
import { useSingleModel } from '@olajs/modx';
import modelB from './modelB';

function useSingleModelB() {
  const { state, dispatchers } = useSingleModel(modelB);

  return (
    <div>
      {state.counter}
      <br />
      <button onClick={() => dispatchers.plusAsync(3000)}>plus</button>
      <br />
      <button onClick={() => dispatchers.minusAsync(3000)}>minus</button>
    </div>
  );
}

export default useSingleModelB;
```

## useModel & withModel

Simple way of `useGlobalModel/useSingleModel` or `withGlobalModel/withSingleModel` methods.

When use `useModel` hooks (since modx@2.1.2), `modx` will use `model` in global state first, if not exists, `modx`
will create a local state for it.

```typescript jsx
import React from 'react';
import { useModel } from '@olajs/modx';
import modelA from './modelA'; // global state
import modelB from './modelB'; // local state

function UseModelExample() {
  const { state: stateA, dispatchers: dispatchersA } = useModel(modelA);
  const { state: stateB, dispatchers: dispatchersB } = useModel(modelB);

  return (
    <div>
      counterA: {stateA.counter}, counterB: {stateB.counter}
      <br />
      <button onClick={() => dispatchersA.plusAsync(3000)}>plusA</button>
      <br />
      <button onClick={() => dispatchersA.minusAsync(3000)}>minusA</button>
      <br />
      <button onClick={() => dispatchersB.plusAsync(3000)}>plusB</button>
      <br />
      <button onClick={() => dispatchersB.minusAsync(3000)}>minusB</button>
    </div>
  );
}

export default UseModelExample;
```

## Thanks

- Thanks [dva](https://github.com/dvajs/dva) for the `model` idea.
- Thanks [foca](https://github.com/foca-js/foca) for the typescript's types optimization idea.

## License

[MIT](https://tldrlegal.com/license/mit-license)
