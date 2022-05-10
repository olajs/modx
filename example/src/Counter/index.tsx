import React from 'react';
import { useSingleModel, UseModelResult, withSingleModel } from '@olajs/modx';
import model from '../model';

function Counter() {
  console.log('counter rendered');
  const { state, dispatchers } = useSingleModel(model);
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plusAsync({ timeout: 1000 })}>+</button>
      <button onClick={() => dispatchers.minusAsync({ timeout: 1000 })}>-</button>
    </div>
  );
}

type Props = { singleModel: UseModelResult<typeof model> };

const CounterClass = withSingleModel(model)(
  class extends React.PureComponent<Props, any> {
    render() {
      const { state, dispatchers } = this.props.singleModel;
      return (
        <div>
          <p>{state.counter}</p>
          <button onClick={() => dispatchers.plus()}>+</button>
          <button onClick={() => dispatchers.minus()}>-</button>
        </div>
      );
    }
  },
);

export { CounterClass };

export default React.memo(Counter);
