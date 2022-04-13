import { ModelConfig, EffectArgs, ModelAction } from '@olajs/modx';

const namespace = 'modelA';

type Dispatchers = {
  plus();
  minus();
  plusAsync(args: { timeout: number });
  minusAsync(args: { timeout: number });
};

type StateType = {
  counter: number;
  counting: boolean;
};

export { namespace, Dispatchers, StateType };
export default {
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
    plus: (state: StateType) => ({ counter: state.counter + 1 }),
    minus: (state: StateType) => ({ counter: state.counter - 1 }),
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
} as ModelConfig;
