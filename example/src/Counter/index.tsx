import React from 'react';
import { useSingleModel } from '@olajs/modx';
import model, { Dispatchers, StateType } from '../model';

function Counter() {
  console.log('counter rendered');
  const { state, dispatchers } = useSingleModel<StateType, Dispatchers>(model);
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plusAsync({ timeout: 1000 })}>+</button>
      <button onClick={() => dispatchers.minusAsync({ timeout: 1000 })}>-</button>
    </div>
  );
}

export default React.memo(Counter);
