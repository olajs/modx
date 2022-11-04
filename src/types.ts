import { Store, Dispatch, AnyAction, Reducer } from 'redux';

export type ModelAction<T = any> = AnyAction & {
  payload?: Partial<T>;
};

export type ModelConfig<Namespace = string, State = object, Reducers = object, Effects = object> = {
  namespace: Namespace;
  state: State;
  reducers: Reducers;
  effects?: Effects;
};

type ReducerFunction<State, FunctionValue> = FunctionValue extends (state: State) => State
  ? () => void
  : FunctionValue extends (state: State, payload: infer Args) => State
  ? (payload: Args) => void
  : never;

type EffectFunction<FunctionValue> = FunctionValue extends (payload?: any) => void
  ? FunctionValue
  : (payload?: any) => void;

export type CreateModelOptions<Namespace, State, Reducers, Effects> = {
  namespace: Namespace;
  state: State;
  reducers: Reducers & {
    [key in keyof Reducers]: (state: State, payload: any) => State;
  };
  // 注意：ThisType 依赖 TS 配置项：noImplicitThis: true，否则在 effects 中没有 this 的自动提示
  effects?: {
    [key in keyof Effects]: EffectFunction<Effects[key]>;
  } & ThisType<
    Readonly<
      {
        [key in keyof Reducers]: ReducerFunction<State, Reducers[key]>;
      } & {
        [key in keyof Effects]: EffectFunction<Effects[key]>;
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
    [key in keyof Effects]: Effects[key];
  } & {
    [key in keyof Reducers]: ReducerFunction<State, Reducers[key]>;
  }
>;

export { Store, Reducer, Dispatch };
