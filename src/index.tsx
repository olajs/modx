import { Store } from 'redux';
import React, { useState, useEffect } from 'react';
import parseModel from './parseModel';
import configureStore from './configureStore';
import { ModelConfig, ModelAction, EffectArgs, EffectFunction } from './types';

/**
 * 创建一个 redux store 实例
 */
function createStore(
  initialState: any,
  modelConfigs: ModelConfig[],
  extra?: { devTools?: boolean },
): Store {
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
 * 为 Class Component 包装一个 singleStore
 */
function withSingleModel(
  modelConfig: ModelConfig,
): (SubComponent: React.ComponentType<any, any>) => React.FC<any> {
  return (SubComponent) => {
    return function WithSingleModelContainer(props) {
      const singleModel = useSingleModel(modelConfig);
      return <SubComponent {...props} singleModel={singleModel} />;
    };
  };
}

type UseSingleModelResult<StateType, Dispatchers> = {
  store: Store;
  state: StateType;
  dispatchers: Dispatchers;
};

/**
 * modelConfig 转 React hooks
 * @param modelConfig
 */
function useSingleModel<StateType, Dispatchers>(
  modelConfig: ModelConfig,
): UseSingleModelResult<StateType, Dispatchers> {
  const [store] = useState(createSingleStore(modelConfig));
  const [state, setState] = useState(store.getState()[modelConfig.namespace]);
  const [dispatchers] = useState(() => {
    const result = {};
    modelConfig.reducers &&
      Object.keys(modelConfig.reducers).forEach((key) => {
        result[key] = (payload) =>
          store.dispatch({ type: `${modelConfig.namespace}/${key}`, payload });
      });
    modelConfig.effects &&
      Object.keys(modelConfig.effects).forEach((key) => {
        result[key] = (payload) =>
          store.dispatch({ type: `${modelConfig.namespace}/${key}`, payload });
      });
    return result;
  });

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[modelConfig.namespace]));
  }, []);
  return { store, state, dispatchers };
}

export {
  ModelConfig,
  ModelAction,
  EffectArgs,
  EffectFunction,
  createStore,
  createSingleStore,
  withSingleModel,
  UseSingleModelResult,
  useSingleModel,
};
