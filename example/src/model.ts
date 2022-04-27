import { EffectArgs, ModelAction, createModel } from '@olajs/modx';

type StateType = {
  counter: number;
  counting: boolean;
};

type ModelType = typeof model;

const namespace = 'modelA';

const model = createModel({
  namespace,
  state: {
    counter: 0,
    counting: false,
  } as StateType,
  reducers: {
    setCounting: (state: StateType, action: ModelAction<boolean>) => ({
      ...state,
      counting: action.payload,
    }),
    plus: (state: StateType) => ({ ...state, counter: state.counter + 1 }),
    minus: (state: StateType) => ({ ...state, counter: state.counter - 1 }),
  },
  effects: {
    plusAsync({
      namespace,
      action,
      prevState,
      dispatcher,
    }: EffectArgs<{ timeout: number }, StateType>) {
      const { counting } = prevState;

      if (counting) return;

      dispatcher(`${namespace}/setCounting`, true);
      setTimeout(() => {
        dispatcher(`${namespace}/plus`);
        dispatcher(`${namespace}/setCounting`, false);
      }, action.payload.timeout);
    },
    minusAsync({
      namespace,
      action,
      prevState,
      dispatcher,
    }: EffectArgs<{ timeout: number }, StateType>) {
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

export { namespace, StateType, ModelType };
export default model;
