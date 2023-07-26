import { Middleware } from 'redux';
import { Store, ModelConfig, ModelAction, Reducer, Dispatch, CreateModelOptions } from './types';
import parseModel from './parseModel';
import configureStore from './configureStore';

export * from './components';

window.__MODX_SHOW_LOG__ = true;

/**
 * 创建一个 redux store 实例
 */
export function createStore<
  InitialState,
  T extends ModelConfig,
  Extra extends {
    devTools?: boolean;
    middlewares?: Middleware[];
  },
>(initialState: InitialState, modelConfigs: T[], extra?: Extra): Store {
  // 是否要关联 redux 的 devTool
  // 一般在全局使用时开启，作为组件状态管理时不开启
  const { devTools } = extra || {};
  const reducers: any = {};
  const middlewares: any[] = [...(extra?.middlewares || [])];

  modelConfigs.forEach((modelConfig) => {
    const { namespace } = modelConfig;
    const model = parseModel(modelConfig);
    if (reducers[namespace]) {
      throw new Error('Duplicated namespace: ' + namespace);
    }
    reducers[namespace] = model.reducer;
    middlewares.push(model.middleware);
  });

  return configureStore({ initialState, reducers, middlewares, devTools });
}

/**
 * 接收单个 modelConfig 创建 redux store
 */
export function createSingleStore<T extends ModelConfig>(
  modelConfig: T,
  middlewares?: Middleware[],
): Store {
  return createStore({}, [modelConfig], { middlewares });
}

/**
 * 包裹 model 声明配置，主要是为了类型推断
 **/
export function createModel<
  Namespace extends string,
  State extends object,
  Reducers extends object,
  Effects extends object,
>(
  modelConfig: CreateModelOptions<Namespace, State, Reducers, Effects>,
): ModelConfig<Namespace, State, Reducers, Effects> {
  return modelConfig as any;
}

/**
 * 设置是否打印 modx 状态变更日志
 */
export function showLog(show: boolean) {
  window.__MODX_SHOW_LOG__ = show;
}

export type { Store, ModelConfig, ModelAction, Reducer, Dispatch };
