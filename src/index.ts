import parseModel from './parseModel';
import configureStore from './configureStore';
import {
  UseModelResult,
  useGlobalModel,
  withGlobalModel,
  useSingleModel,
  withSingleModel,
} from './components';
import { Store, ModelConfig, ModelAction, EffectArgs, EffectFunction } from './types';

/**
 * 创建一个 redux store 实例
 */
function createStore(
  initialState: any,
  modelConfigs: ModelConfig[],
  extra?: { devTools?: boolean },
): Store {
  // 是否要关联 redux 的 devTool
  // 一般在全局使用时开启，作为组件状态管理时不开启
  const { devTools } = extra || {};
  const reducers = {};
  const middlewares = [];

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
function createSingleStore(modelConfig: ModelConfig): Store {
  return createStore({}, [modelConfig]);
}

/**
 * 用于在 Typescript 中获取 model 的类型声明
 * @param modelConfig
 * @returns
 */
function createModel<T extends ModelConfig>(modelConfig: T): T {
  return modelConfig as any;
}

export {
  ModelConfig,
  ModelAction,
  EffectArgs,
  EffectFunction,
  createStore,
  createSingleStore,
  createModel,
  UseModelResult,
  useGlobalModel,
  withGlobalModel,
  useSingleModel,
  withSingleModel,
};
