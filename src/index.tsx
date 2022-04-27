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
 * 用于在 Typescript 中获取 model 的类型声明
 * @param modelConfig
 * @returns
 */
function createModel<T extends ModelConfig>(modelConfig: T): T {
  return modelConfig as any;
}

type Dispatchers<T extends ModelConfig> = {
  [P in keyof T['reducers'] | keyof T['effects']]: (payload: any) => void;
};

/**
 * 获取指定 namespace 的 model 的 dispatchers 方法
 * @param store
 * @param namespace
 * @returns {{}}
 */
function getDispatchers<T extends ModelConfig>(store: Store, namespace: string): Dispatchers<T> {
  const dispatcherKeys = store.dispatcherKeys[namespace] || [];
  const result = {} as Dispatchers<T>;

  dispatcherKeys.forEach((key: keyof T['reducers'] | keyof T['effects']) => {
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
function withGlobalModel<T extends ModelConfig>(namespace: string) {
  return (
    SubComponent: React.ComponentType<{
      globalModel: UseGlobalModelResult<T>;
      [key: string]: any;
    }>,
  ) =>
    React.memo(function withGlobalModelContainer(props: unknown) {
      const globalModel = useGlobalModel<T>(namespace);
      return <SubComponent {...props} globalModel={globalModel} />;
    });
}

type UseGlobalModelResult<T extends ModelConfig> = {
  store: Store;
  state: T['state'];
  dispatchers: Dispatchers<T>;
};

/**
 * 获取指定 namespace 的全局状态的 hooks
 * @param namespace
 */
function useGlobalModel<T extends ModelConfig>(namespace: string): UseGlobalModelResult<T> {
  const store = useStore();
  const [state, setState] = useState(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers<T>(store, namespace));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 为 Class Component 包装一个 singleStore
 */
function withSingleModel<T extends ModelConfig>(
  modelConfig: T,
): (
  SubComponent: React.ComponentType<{
    singleModel: UseSingleModelResult<T>;
    [key: string]: any;
  }>,
) => React.FC<any> {
  return (SubComponent) => {
    return React.memo(function WithSingleModelContainer(props: unknown) {
      const singleModel = useSingleModel<T>(modelConfig);
      return <SubComponent {...props} singleModel={singleModel} />;
    });
  };
}

type UseSingleModelResult<T extends ModelConfig> = {
  store: Store;
  state: T['state'];
  dispatchers: Dispatchers<T>;
};

/**
 * modelConfig 转 React hooks
 * @param modelConfig
 */
function useSingleModel<T extends ModelConfig>(modelConfig: T): UseSingleModelResult<T> {
  const [store] = useState(createSingleStore(modelConfig));
  const [state, setState] = useState(store.getState()[modelConfig.namespace]);
  const [dispatchers] = useState(() => {
    return getDispatchers<T>(store, modelConfig.namespace);
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
  createModel,
  withGlobalModel,
  UseGlobalModelResult,
  useGlobalModel,
  withSingleModel,
  UseSingleModelResult,
  useSingleModel,
};
