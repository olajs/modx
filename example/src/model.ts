import { EffectArgs, ModelAction, createModel } from '@olajs/modx';

const namespace = 'modelA';

const model = createModel({
  namespace,
  state: {
    counter: 0,
    counting: false,
  },
  reducers: {
    setCounting: (state, action: ModelAction<boolean>) => ({
      ...state,
      counting: action.payload,
    }),
    plus: (state) => ({ ...state, counter: state.counter + 1 }),
    minus: (state) => ({ ...state, counter: state.counter - 1 }),
  },
  effects: {
    plusAsync: ({ namespace, action, prevState, dispatcher }: EffectArgs<{ timeout: number }>) => {
      const { counting } = prevState;

      if (counting) return;

      dispatcher(`${namespace}/setCounting`, true);
      setTimeout(() => {
        dispatcher(`${namespace}/plus`);
        dispatcher(`${namespace}/setCounting`, false);
      }, action.payload.timeout);
    },
    minusAsync({ namespace, action, prevState, dispatcher }: EffectArgs<{ timeout: number }>) {
      const { counting } = prevState;
      if (counting) return;

      dispatcher(`${namespace}/setCounting`, true);
      setTimeout(() => {
        dispatcher(`${namespace}/minus`);
        dispatcher(`${namespace}/setCounting`, false);
      }, action.payload.timeout);
    },
  },
});

export { namespace };
export default model;
