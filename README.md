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

### Create model

```typescript
// modelA.ts

import { ModelConfig } from '@olajs/modx';

type StateType = { counter: number };
const namespace = 'modelA';

export { namespace, StateType };
export default {
  namespace,
  state: {
    counter: 0,
  } as StateType,
  reducers: {
    plus: (state: StateType) => ({ counter: state.counter + 1 }),
    minus: (state: StateType) => ({ counter: state.counter - 1 }),
  },
} as ModelConfig;
```

### Simple use

```typescript
// store.ts

import { createStore } from '@olajs/modx';
import modelA, { namespace } from './modelA';

const store = createStore({}, [modelA]);

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
import { connect } from 'react-redux';
import { namespace, StateType } from './modelA';

type Props = {
  state: StateType;
  plus();
  minus();
};

function App(props: Props) {
  return (
    <div>
      {props.state.counter}
      <br />
      <button onClick={props.plus}>plus</button>
      <br />
      <button onClick={props.minus}>minus</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  state: { ...state[namespace] },
});
const mapDispatchToProps = (dispatch) => ({
  plus() {
    dispatch({ type: `${namespace}/plus` });
  },
  minus() {
    dispatch({ type: `${namespace}/minus` });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
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
import { withSingleModel } from '@olajs/modx';
import modelA, { StateType } from './modelA';

type Dispatchers = {
  plus();
  minus();
};

type Props = {
  state: StateType;
  dispatchers: Dispatchers;
};

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

export default withSingleModel<StateType, Dispatchers>(modelA)(WithSingleModel);
```

### Using in Function Component

```typescript jsx
// useSingleModel.tsx

import React from 'react';
import { useSingleModel } from '@olajs/modx';
import modelA, { StateType } from './modelA';

type Dispatchers = {
  plus();
  minus();
};

function UseSingleModel() {
  const { state, dispatchers } = useSingleModel<StateType, Dispatchers>(modelA);

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

export default UseSingleModel;
```

### Using async logic

```typescript jsx
// modelB.ts

import { ModelConfig, EffectArgs } from '@olajs/modx';

type StateType = { counter: number };
const namespace = 'modelB';

export { namespace, StateType };
export default {
  namespace,
  state: {
    counter: 0,
  } as StateType,
  reducers: {
    plus: (state: StateType) => ({ counter: state.counter + 1 }),
    minus: (state: StateType) => ({ counter: state.counter - 1 }),
  },
  effects: {
    plusAsync({ namespace, next, action }: EffectArgs<{ timeout: number }>) {
      setTimeout(() => {
        next({ type: `${namespace}/plus` });
      }, action.payload.timeout);
    },
    minusAsync({ namespace, next, action }: EffectArgs<{ timeout: number }>) {
      setTimeout(() => {
        next({ type: `${namespace}/minus` });
      }, action.payload.timeout);
    },
  },
} as ModelConfig;
```

```typescript jsx
// useSingleModelB.tsx

import React from 'react';
import { useSingleModel } from '@olajs/modx';
import modelB, { StateType } from './modelB';

type Dispatchers = {
  plusAsync(args: { timeout: number });
  minusAsync(args: { timeout: number });
};

function useSingleModelB() {
  const { state, dispatchers } = useSingleModel<StateType, Dispatchers>(modelB);

  return (
    <div>
      {state.counter}
      <br />
      <button onClick={() => dispatchers.plusAsync({ timeout: 3000 })}>plus</button>
      <br />
      <button onClick={() => dispatchers.minusAsync({ timeout: 3000 })}>minus</button>
    </div>
  );
}

export default useSingleModelB;
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
