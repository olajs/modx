import React, { PropsWithChildren } from 'react';
import { useModel, withShareModel, UseModelResult, useShareModel } from '..';
import model from './testModel';

function Counter() {
  const { state, dispatchers } = useModel(model);
  console.log('counter rendered');
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => dispatchers.plus()}>+</button>
      <button onClick={() => dispatchers.minus()}>-</button>
      <p>async</p>
      <button onClick={() => dispatchers.plusAsync(1000)}>+</button>
      <button onClick={() => dispatchers.minusAsync(2000)}>-</button>
      <Comp3 name="Comp3">
        <Comp2 />
      </Comp3>
      <Comp4 />
    </div>
  );
}

const selector = (state: typeof model.state) => ({ counter: state.counter });

const Comp1 = () => {
  const { state } = useShareModel(model, (state) => ({
    counting: state.counting,
  }));
  return state.counting;
};

const Comp2 = () => {
  const { state } = useShareModel(model);
  return <span>{state.counting}</span>;
};

type Props = PropsWithChildren<{
  name: string;
  test?: UseModelResult<typeof model>;
}>;

const Comp3 = withShareModel(
  model,
  selector,
)<Props>(
  class extends React.PureComponent<
    Props & {
      shareModel: UseModelResult<typeof model, typeof selector>;
    },
    any
  > {
    render() {
      const { state } = this.props.shareModel;
      return (
        <span>
          <span>{state.counter}</span>
          {this.props.children}
        </span>
      );
    }
  },
);

const Comp4 = withShareModel(model)<{}>(
  class extends React.PureComponent<{ shareModel: UseModelResult<typeof model> }, any> {
    render() {
      const { state } = this.props.shareModel;
      return (
        <span>
          <span>{state.counter}</span>
        </span>
      );
    }
  },
);

export { Comp1, Comp2, Comp3, Comp4 };

export default Counter;
