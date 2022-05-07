import { Store, Dispatch, AnyAction, Reducer } from 'redux';

export type ModelAction<T = any> = AnyAction & {
  payload?: T;
};

export type EffectArgs<Payload = any, State = any> = {
  namespace: string;
  store: Store;
  next: Dispatch;
  // 将当前 model 的 state 直接获取了传参，方便开发人员获取
  prevState: State;
  // 简化 store.dispatch() 方法的调用
  dispatcher(actionType: string, payload?: Payload);
};

export type EffectFunction = (args: EffectArgs) => void;

export type ModelConfig = {
  namespace: string;
  state: any;
  reducers?: {
    [reducerName: string]: Reducer;
  };
  effects?: {
    [effectName: string]: EffectFunction;
  };
};

export type GetDispatchers<T extends ModelConfig> = {
  [P in keyof T['reducers']]: (state?: Partial<T['state']>) => T['state'];
} & {
  [P in keyof T['effects']]: T['effects'][P];
};

export { Store, Reducer, Dispatch };
