import { Store, Dispatch, AnyAction, Reducer } from 'redux';

type ModelAction<T = any> = AnyAction & {
  payload?: T;
};

type EffectArgs<PayloadType = any, StateType = any> = {
  namespace: string;
  store: Store;
  next: Dispatch;
  action: ModelAction<PayloadType>;
  // 将当前 model 的 state 直接获取了传参，方便开发人员获取
  prevState: StateType;
  // 简化 store.dispatch() 方法的调用
  dispatcher(actionType: string, payload?: any);
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
