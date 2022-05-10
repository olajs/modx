import React from 'react';
import { useGlobalModel } from '@olajs/modx';
import model from './model';
import Counter, { CounterClass } from './Counter';

function App() {
  const { state, dispatchers } = useGlobalModel(model);
  console.log('app rendered');
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>Async</p>
      <Counter />
      <p>Class Component</p>
      <CounterClass />
    </div>
  );
}

export default App;
