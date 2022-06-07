import { Store, Dispatch, AnyAction, Reducer } from 'redux';

export type ModelAction<T = any> = AnyAction & {
  payload?: Partial<T>;
};

export type ModelConfig<Namespace, State, Reducers, Effects> = {
  namespace: Namespace;
  state: State;
  reducers: Reducers;
  effects?: Effects;
};

export type CreateModelOptions<Namespace, State, Reducers, Effects> = {
  namespace: Namespace;
  state: State;
  reducers: Reducers & {
    [p in keyof Reducers]: (state: State, action: ModelAction<State>) => State;
  };
  // 注意：ThisType 依赖 TS 配置项：noImplicitThis: true，否则在 effects 中没有 this 的自动提示
  effects?: Effects &
    ThisType<
      {
        [p in keyof Reducers]: (payload?: Partial<State>) => void;
      } & {
        [p in keyof Effects]: (arg?: any) => void;
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

export type GetDispatchers<State, Reducers, Effects> = Effects & {
  [P in keyof Reducers]: (payload?: Partial<State>) => void;
};

export { Store, Reducer, Dispatch };
