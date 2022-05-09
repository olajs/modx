import { Store, Dispatch, AnyAction, Reducer } from 'redux';

export type ModelAction<T = any> = AnyAction & {
  payload?: T;
};

export type ModelConfig = {
  namespace: string;
  state: any;
  reducers?: {
    [key: string]: Reducer;
  };
  effects?: {
    [key: string]: (payload?: any) => void;
  };
};

export type CreateModelOptions<Namespace, State, Reducers, Effects> = {
  namespace: Namespace;
  state: State;
  reducers?: Reducers & {
    [p in keyof Reducers]: Reducer<State>;
  };
  effects?: Effects &
    ThisType<
      {
        [p in keyof Reducers]: (payload?: Partial<State>) => void;
      } & {
        namespace: Namespace;
        store: Store;
        next: Dispatch;
        // 将当前 model 的 state 直接获取了传参，方便开发人员获取
        prevState: State;
        // 简化 store.dispatch() 方法的调用
        dispatcher(actionType: string, payload?: any): void;
      }
    >;
};

export type GetDispatchers<T extends ModelConfig> = {
  [P in keyof T['reducers']]: (payload?: Partial<T['state']>) => void;
} & {
  [P in keyof T['effects']]: T['effects'][P];
};

export { Store, Reducer, Dispatch };
