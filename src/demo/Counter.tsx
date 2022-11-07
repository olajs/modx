import React, { PropsWithChildren } from 'react';
import {
  useModel,
  withShareModel,
  UseModelResult,
  useShareModel,
  useGlobalModel,
  useSingleModel,
} from '..';
import model from './testModel';

const selector = (state: typeof model.state) => ({ counter: state.counter });

function Counter() {
  const { state, dispatchers } = useModel(model);
  const { state: state2 } = useModel(model, selector);
  const { state: state3 } = useGlobalModel(model, selector);
  const { state: state4 } = useSingleModel(model);
  const { state: state5 } = useSingleModel(model, selector);
  console.log('counter rendered');
  return (
    <div>
      <p>
        {state.counter} {state2.counter} {state3.counter} {state4.counter} {state5.counter}
      </p>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>async</p>
      <button onClick={() => dispatchers.plusAsync(1000)}>+</button>
      <button onClick={() => dispatchers.minusAsync(2000)}>-</button>
      <Comp2 name="Comp3">
        <Comp1 />
      </Comp2>
      <Comp3 />
    </div>
  );
}

const Comp1 = () => {
  const { state } = useShareModel(model);
  const { state: state2 } = useShareModel(model, (state) => ({
    counting2: state.counting,
  }));
  return (
    <span>
      {state.counting} {state2.counting2}
    </span>
  );
};

type Props = PropsWithChildren<{
  name: string;
  test?: UseModelResult<typeof model>;
}>;

const Comp2 = withShareModel(
  model,
  selector,
)<Props>(
  class extends React.PureComponent<
    Props & {
      model: UseModelResult<typeof model, typeof selector>;
    },
    any
  > {
    render() {
      const { state } = this.props.model;
      return (
        <span>
          <span>{state.counter}</span>
          {this.props.children}
        </span>
      );
    }
  },
);

const Comp3 = withShareModel(model)<{}>(
  class extends React.PureComponent<{ model: UseModelResult<typeof model> }, any> {
    render() {
      const { state } = this.props.model;
      return (
        <span>
          <span>{state.counter}</span>
        </span>
      );
    }
  },
);

export { Comp1, Comp2, Comp3 };

export default Counter;
