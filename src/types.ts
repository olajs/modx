import { Store, Dispatch, AnyAction, Reducer } from 'redux';

type ModelAction<T = any> = AnyAction & {
  payload?: T;
};

type EffectArgs = {
  namespace: string;
  store: Store;
  next: Dispatch;
  action: ModelAction;
};

type EffectFunction = (args: EffectArgs) => void;

type ModelConfig = {
  namespace: string;
  state: any;
  reducers?: {
    [reducerName: string]: Reducer;
  };
  effects?: {
    [effectName: string]: EffectFunction;
  };
};

export { ModelConfig, EffectArgs, EffectFunction, ModelAction };
