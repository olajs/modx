import { Store, ModelConfig, ModelAction, Reducer, Dispatch, CreateModelOptions } from './types';
import parseModel from './parseModel';
import configureStore from './configureStore';

export * from './components';

/**
 * 创建一个 redux store 实例
 */
export function createStore<
  InitialState,
  Namespace,
  State,
  Reducers,
  Effects,
  Extra extends { devTools?: boolean },
>(
  initialState: InitialState,
  modelConfigs: ModelConfig<Namespace, State, Reducers, Effects>[],
  extra?: Extra,
): Store {
  // 是否要关联 redux 的 devTool
  // 一般在全局使用时开启，作为组件状态管理时不开启
  const { devTools } = extra || {};
  const reducers: any = {};
  const middlewares: any[] = [];

  modelConfigs.forEach((modelConfig) => {
    const { namespace } = modelConfig;
    const model = parseModel(modelConfig);
    if (reducers[namespace]) {
      throw new Error('Duplicated namespace: ' + namespace);
    }
    if (model.reducer) {
      reducers[namespace] = model.reducer;
    }
    if (model.middleware) {
      middlewares.push(model.middleware);
    }
  });

  return configureStore({ initialState, reducers, middlewares, devTools });
}

/**
 * 接收单个 modelConfig 创建 redux store
 */
export function createSingleStore<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
): Store {
  return createStore({}, [modelConfig]);
}

// type GetNamespace<T> = T extends { namespace: unknown } ? T['namespace'] : string;
// type GetState<T> = T extends { state: unknown } ? T['state'] : unknown;
// type GetReducers<T> = T extends { reducers: unknown }
//   ? {
//       [R in keyof T['reducers']]: (
//         state: GetState<T>,
//         action?: ModelAction<GetState<T>>,
//       ) => GetState<T>;
//     }
//   : {
//       [key: string]: Reducer;
//     };
// type GetEffects<T> = T extends { effects: unknown }
//   ? T['effects'] &
//       ThisType<
//         {
//           [P in keyof GetReducers<T>]: (payload?: Partial<GetState<T>>) => void;
//         } & {
//           namespace: GetNamespace<T>;
//           store: Store;
//           next: Dispatch;
//           // 将当前 model 的 state 直接获取了传参，方便开发人员获取
//           prevState: GetState<T>;
//           // 简化 store.dispatch() 方法的调用
//           dispatcher(actionType: string, payload?: any): void;
//         }
//       >
//   : {
//       [key: string]: (payload?: any) => void;
//     };

// type CreateModelOption<T> = T & {
//   namespace: GetNamespace<T>;
//   state: GetState<T>;
//   reducers?: GetReducers<T>;
//   effects?: GetEffects<T>;
// };

// /**
//  * 用于在 Typescript 中获取 model 的类型声明
//  * @param modelConfig
//  * @returns
//  */
// export function createModel<T>(modelConfig: CreateModelOption<T>): T {
//   return modelConfig as any;
// }

/**
 * 包裹 model 声明配置，主要是为了类型推断
 **/
export function createModel<Namespace, State, Reducers, Effects, Others>(
  modelConfig: CreateModelOptions<Namespace, State, Reducers, Effects>,
): ModelConfig<Namespace, State, Reducers, Effects> {
  return modelConfig as any;
}

export { Store, ModelConfig, ModelAction, Reducer, Dispatch };
