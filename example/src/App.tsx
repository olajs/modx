import React from 'react';
import { useModel } from '@olajs/modx';
import model from './model';
import Counter, { CounterClass } from './Counter';

function Block({ children }) {
  return <div style={{ paddingLeft: '40px' }}>{children}</div>;
}

function App() {
  const { state, dispatchers } = useModel(model);
  console.log('app rendered');
  return (
    <div>
      <h3>Global Model</h3>
      <Block>
        <p>counter: {state.counter}</p>
        <button onClick={() => dispatchers.plus()}>+</button>
        <button onClick={() => dispatchers.minus()}>-</button>
      </Block>
      <h3>Single Model</h3>
      <Block>
        <h4>Async</h4>
        <Block>
          <Counter />
        </Block>
        <h4>Class Component</h4>
        <Block>
          <CounterClass />
        </Block>
      </Block>
    </div>
  );
}

export default App;
