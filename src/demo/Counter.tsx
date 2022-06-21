import React from 'react';
import { useSingleModel } from '..';
import model from './testModel';

function Counter() {
  const { state, dispatchers } = useSingleModel(model);
  console.log('counter rendered');
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>async</p>
      <button onClick={() => dispatchers.plusAsync(1000)}>+</button>
      <button onClick={() => dispatchers.minusAsync(2000)}>-</button>
    </div>
  );
}

export default Counter;
