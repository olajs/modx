import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { ModelConfig, Store, GetDispatchers } from './types';
import { createSingleStore } from '.';

export type UseModelResult<T extends ModelConfig> = {
  store: Store;
  state: T['state'];
  dispatchers: GetDispatchers<T>;
};

/**
 * 获取指定 modelConfig 的全局状态的 hooks
 * @param modelConfig
 */
export function useGlobalModel<T extends ModelConfig>(modelConfig: T): UseModelResult<T> {
  const { namespace } = modelConfig;
  const store = useStore();
  const [state, setState] = useState<T['state']>(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers<T>(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 包装一个拥有指定 modelConfig 的全局状态的组件
 * @param modelConfig
 */
export function withGlobalModel<T extends ModelConfig>(modelConfig: T) {
  return (
    SubComponent: React.ComponentType<{
      globalModel: UseModelResult<T>;
      [key: string]: any;
    }>,
  ) =>
    React.memo(function withGlobalModelContainer(props: unknown) {
      const globalModel = useGlobalModel<T>(modelConfig);
      return <SubComponent {...props} globalModel={globalModel} />;
    });
}

/**
 * modelConfig 转 React hooks
 * @param modelConfig
 */
export function useSingleModel<T extends ModelConfig>(modelConfig: T): UseModelResult<T> {
  const [store] = useState(createSingleStore(modelConfig));
  const [state, setState] = useState(store.getState()[modelConfig.namespace]);
  const [dispatchers] = useState(() => {
    return getDispatchers<T>(store, modelConfig);
  });

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[modelConfig.namespace]));
  }, []);
  return { store, state, dispatchers };
}

/**
 * 为 Class Component 包装一个 singleStore
 */
export function withSingleModel<T extends ModelConfig>(
  modelConfig: T,
): (
  SubComponent: React.ComponentType<{
    singleModel: UseModelResult<T>;
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

/**
 * 获取指定 namespace 的 model 的 dispatchers 方法
 * @param store
 * @param modelConfig
 * @returns {{}}
 */
function getDispatchers<T extends ModelConfig>(store: Store, modelConfig: T): GetDispatchers<T> {
  const { namespace } = modelConfig;
  const result = {};

  [...Object.keys(modelConfig.reducers || {}), ...Object.keys(modelConfig.effects || {})].forEach(
    (key: string) => {
      result[key] = function (payload: any) {
        store.dispatch({
          type: `${namespace}/${key}`,
          payload,
        });
      };
    },
  );

  return result as GetDispatchers<T>;
}
