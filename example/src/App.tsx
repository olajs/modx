import React from 'react';
import { useModel } from '@olajs/modx';
import model from './model';
import Counter, { CounterClass } from './Counter';
import ShareModel from './ShareModel';

function Block({ children }) {
  return <div style={{ background: '#e7e7e7', padding: '10px' }}>{children}</div>;
}

function App() {
  const { state, dispatchers } = useModel(model);
  console.log('app rendered');
  console.log('state from getState:', dispatchers.getState());

  return (
    <div>
      <h3>Global Model</h3>
      <Block>
        <p>counter: {state.counter}</p>
        <button onClick={() => dispatchers.plus()}>+</button>
        <button onClick={() => dispatchers.minus()}>-</button>
        <button onClick={() => dispatchers.setState({ counter: 500 })}>setState(500)</button>
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
      <h3>Share Store</h3>
      <Block>
        <ShareModel />
      </Block>
    </div>
  );
}

export default App;
