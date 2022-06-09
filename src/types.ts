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

type ReducerWithAction<State> = (state: State, action: ModelAction<State>) => State;
type ReducerNoAction<State> = (state: State) => State;

export type CreateModelOptions<Namespace, State, Reducers, Effects> = {
  namespace: Namespace;
  state: State;
  reducers: Reducers & {
    [p in keyof Reducers]: (state: State, action: ModelAction<State>) => State;
  };
  // 注意：ThisType 依赖 TS 配置项：noImplicitThis: true，否则在 effects 中没有 this 的自动提示
  effects?: Effects &
    ThisType<
      Readonly<
        {
          [p in keyof Reducers]: Reducers[p] extends ReducerNoAction<State>
            ? () => void
            : Reducers[p] extends ReducerWithAction<State>
            ? (payload: Partial<State>) => void
            : any;
        } & {
          [p in keyof Effects]: Effects[p];
        } & {
          namespace: Namespace;
          store: Readonly<Store>;
          next: Dispatch;
          // 将当前 model 的 state 直接获取了传参，方便开发人员获取
          prevState: Readonly<State>;
          // 简化 store.dispatch() 方法的调用
          dispatcher(actionType: string, payload?: any): void;
        }
      >
    >;
};

export type GetDispatchers<State, Reducers, Effects> = Readonly<
  {
    [p in keyof Effects]: Effects[p];
  } & {
    [P in keyof Reducers]: Reducers[P] extends ReducerNoAction<State>
      ? () => void
      : Reducers[P] extends ReducerWithAction<State>
      ? (payload: Partial<State>) => void
      : any;
  }
>;

export { Store, Reducer, Dispatch };
