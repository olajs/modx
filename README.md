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

const namespace = 'moduleA';
const StateType = { counter: number };

export { namespace, StateType };
export default {
  namespace,
  state: {
    counter: 0,
  },
  reducers: {
    plus: (state) => ({ counter: state.counter + 1 }),
    minus: (state) => ({ counter: state.counter - 1 }),
  },
} as ModelConfig;
```

### simple use

```typescript
// store.ts

import { createStore } from '@olajs/modx';
import modelA from './moduleA';

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

### use in React with react-redux

```typescript jsx
// App.ts

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
// main.ts

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from '@olajs/modx';
import modelA from './modelA';
import App from './App';

const store = createStore({}, [modelA]);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementByid('app'),
);
```
