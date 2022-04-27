import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux';
import parseModel from './parseModel';
import configureStore from './configureStore';
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
  const dispatcherKeys = {};

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
    // 保存每个 model 的 reducers 和 effects 的 key
    // 方便 getDispatchers 来获取
    dispatcherKeys[modelConfig.namespace] = Object.keys(modelConfig.reducers || {}).concat(
      Object.keys(modelConfig.effects || {}),
    );
  });

  const store = configureStore({ initialState, reducers, middlewares, devTools });
  store.dispatcherKeys = dispatcherKeys;

  return store;
}

/**
 * 接收单个 modelConfig 创建 redux store
 */
function createSingleStore(modelConfig: ModelConfig): Store {
  return createStore({}, [modelConfig]);
}

/**
 * 获取指定 namespace 的 model 的 dispatchers 方法
 * @param store
 * @param namespace
 * @returns {{}}
 */
function getDispatchers<Dispatchers = any>(store: Store, namespace: string): Dispatchers {
  const dispatcherKeys = store.dispatcherKeys[namespace] || [];
  const result = {} as Dispatchers;

  dispatcherKeys.forEach((key) => {
    result[key] = function (payload) {
      store.dispatch({
        type: `${namespace}/${key}`,
        payload,
      });
    };
  });

  return result;
}

/**
 * 包装一个拥有指定 namespace 的全局状态的组件
 * @param namespace
 */
function withGlobalModel<StateType, Dispatchers>(namespace: string) {
  return (
    SubComponent: React.ComponentType<{
      globalModel: UseGlobalModelResult<StateType, Dispatchers>;
      [key: string]: any;
    }>,
  ) =>
    React.memo(function withGlobalModelContainer(props: unknown) {
      const globalModel = useGlobalModel<StateType, Dispatchers>(namespace);
      return <SubComponent {...props} globalModel={globalModel} />;
    });
}

type UseGlobalModelResult<StateType, Dispatchers> = {
  store: Store;
  state: StateType;
  dispatchers: Dispatchers;
};

/**
 * 获取指定 namespace 的全局状态的 hooks
 * @param namespace
 */
function useGlobalModel<StateType, Dispatchers>(
  namespace: string,
): UseGlobalModelResult<StateType, Dispatchers> {
  const store = useStore();
  const [state, setState] = useState(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers(store, namespace));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 为 Class Component 包装一个 singleStore
 */
function withSingleModel<StateType, Dispatchers>(
  modelConfig: ModelConfig,
): (
  SubComponent: React.ComponentType<{
    singleModel: UseSingleModelResult<StateType, Dispatchers>;
    [key: string]: any;
  }>,
) => React.FC<any> {
  return (SubComponent) => {
    return React.memo(function WithSingleModelContainer(props: unknown) {
      const singleModel = useSingleModel<StateType, Dispatchers>(modelConfig);
      return <SubComponent {...props} singleModel={singleModel} />;
    });
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
    return getDispatchers(store, modelConfig.namespace);
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
  getDispatchers,
  withGlobalModel,
  UseGlobalModelResult,
  useGlobalModel,
  withSingleModel,
  UseSingleModelResult,
  useSingleModel,
};
