import React from 'react';
import { useModel, UseModelResult, withModel } from '@olajs/modx';
import model from './model';

function Counter() {
  console.log('counter rendered');
  const { state, dispatchers } = useModel(model);
  return (
    <div>
      <p>
        counter: {state.counter}, counting: {state.counting.toString()}
      </p>
      <button onClick={() => dispatchers.setCounting(!state.counting)}>set counting</button>
      <button onClick={() => dispatchers.plusAsync(1000)}>+</button>
      <button onClick={() => dispatchers.minusAsync(1000)}>-</button>
    </div>
  );
}

type Props = {
  model: UseModelResult<typeof model>;
};

const CounterClass = withModel(model)(
  class extends React.PureComponent<Props, any> {
    render() {
      const { state, dispatchers } = this.props.model;
      return (
        <div>
          <p>counter: {state.counter}</p>
          <button onClick={() => dispatchers.plus()}>+</button>
          <button onClick={() => dispatchers.minus()}>-</button>
        </div>
      );
    }
  },
);

export { CounterClass };

export default React.memo(Counter);
