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
    plusAsync({ namespace, next, action, store }: EffectArgs<{ timeout: number }>) {
      const { counting } = store.getState()[namespace] as StateType;
      if (counting) return;

      next({ type: `${namespace}/setCounting`, payload: true });
      setTimeout(() => {
        next({ type: `${namespace}/plus` });
        next({ type: `${namespace}/setCounting`, payload: false });
      }, action.payload.timeout);
    },
    minusAsync({ namespace, next, action, store }: EffectArgs<{ timeout: number }>) {
      const { counting } = store.getState()[namespace] as StateType;
      if (counting) return;

      next({ type: `${namespace}/setCounting`, payload: true });
      setTimeout(() => {
        next({ type: `${namespace}/minus` });
        next({ type: `${namespace}/setCounting`, payload: false });
      }, action.payload.timeout);
    },
  },
} as ModelConfig;
