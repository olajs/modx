import React, { PropsWithChildren } from 'react';
import { useShareModel, withShareModel, UseModelResult } from '@olajs/modx';
import { model } from './model';

function Comp1() {
  console.log('share comp1 rendered');
  const { state } = useShareModel(model, (state: typeof model.state) => ({
    value: state.value,
  }));
  return <div>Comp1: {state.value}</div>;
}

type Props = PropsWithChildren<{
  shareModel: UseModelResult<typeof model>;
}>;

const Comp2 = withShareModel(model)<PropsWithChildren<{}>>(
  class extends React.PureComponent<Props, any> {
    render() {
      console.log('share comp2 rendered');
      const { state, dispatchers } = this.props.shareModel;
      return (
        <span>
          <span>Comp2:</span>
          <input
            type="text"
            value={state.value}
            onChange={(e) => dispatchers.setValue(e.target.value)}
            style={{ width: 300 }}
          />
          <input
            type="text"
            value={state.value2}
            onChange={(e) => dispatchers.setValue2(e.target.value)}
            style={{ width: 300 }}
          />
          {this.props.children}
        </span>
      );
    }
  },
);

function Comp3() {
  const { state, dispatchers } = useShareModel(model, (state) => ({ value2: state.value2 }));
  console.log('share Comp3 rendered');
  return (
    <div>
      <span>Comp3: {state.value2}</span>
      <button type="button" onClick={() => dispatchers.reset()}>
        Reset
      </button>
    </div>
  );
}

function ShareStore() {
  return (
    <div>
      <Comp1 />
      <Comp2>
        <Comp3 />
      </Comp2>
    </div>
  );
}

export default React.memo(ShareStore);
