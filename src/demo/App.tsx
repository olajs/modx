import React from 'react';
import { useGlobalModel, createStore } from '..';
import model from './testModel';

const store = createStore({}, [model], { devTools: false });
console.log(store);

function App() {
  const { state, dispatchers } = useGlobalModel(model);
  console.log('app rendered');
  return (
    <div>
      <p>
        {state.counter} {state.counting}
      </p>
      <button onClick={() => dispatchers.setCounting(!state.counting)}>set counting</button>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>async</p>
      <button onClick={() => dispatchers.plusAsync(1000)}>+</button>
      <button onClick={() => dispatchers.minusAsync(2000)}>-</button>
    </div>
  );
}

export default App;
