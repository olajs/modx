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
    </div>
  );
}

export default App;
