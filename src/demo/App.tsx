import React from 'react';
import { useGlobalModel } from '..';
import model from './testModel';

function App() {
  const { state, dispatchers } = useGlobalModel(model);
  console.log('app rendered');
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>async</p>
      <button onClick={() => dispatchers.plusAsync({ timeout: 1000 })}>+</button>
      <button onClick={() => dispatchers.minusAsync({ timeout: 2000 })}>-</button>
    </div>
  );
}

export default App;
