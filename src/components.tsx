import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { ModelConfig, Store, GetDispatchers } from './types';
import { createSingleStore } from '.';

export type UseModelResult<
  T extends ModelConfig<T['namespace'], T['state'], T['reducers'], T['effects']>,
> = Readonly<{
  store: Readonly<Store>;
  state: Readonly<T['state']>;
  dispatchers: GetDispatchers<T['state'], T['reducers'], T['effects']>;
}>;

/**
 * 获取指定 modelConfig 的状态的 hooks
 */
export function useModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
): UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>> {
  const { namespace } = modelConfig;

  // 自动判断是全局 model 还是组件内部 model
  const storeGlobal = useStore();
  const [store] = useState(() => {
    if (namespace in storeGlobal.getState()) {
      return storeGlobal;
    }
    return createSingleStore(modelConfig);
  });

  const [state, setState] = useState<State>(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 包装一个拥有指定 modelConfig 的状态的组件
 */
export function withModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
) {
  return (
    SubComponent: React.ComponentType<{
      model: UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>>;
      [key: string]: any;
    }>,
  ) =>
    React.memo(function withGlobalModelContainer(props: unknown) {
      const model = useModel(modelConfig);
      return <SubComponent {...props} model={model} />;
    });
}

/**
 * 获取指定 modelConfig 的全局状态的 hooks
 */
export function useGlobalModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
): UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>> {
  const { namespace } = modelConfig;
  const store = useStore();
  const [state, setState] = useState<State>(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 包装一个拥有指定 modelConfig 的全局状态的组件
 */
export function withGlobalModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
) {
  return (
    SubComponent: React.ComponentType<{
      globalModel: UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>>;
      [key: string]: any;
    }>,
  ) =>
    React.memo(function withGlobalModelContainer(props: unknown) {
      const globalModel = useGlobalModel(modelConfig);
      return <SubComponent {...props} globalModel={globalModel} />;
    });
}

/**
 * modelConfig 转 React hooks
 */
export function useSingleModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
): UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>> {
  const [store] = useState(createSingleStore(modelConfig));
  const [state, setState] = useState<State>(store.getState()[modelConfig.namespace]);
  const [dispatchers] = useState(() => {
    return getDispatchers(store, modelConfig);
  });

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[modelConfig.namespace]));
  }, []);
  return { store, state, dispatchers };
}

/**
 * 为 Class Component 包装一个 singleStore
 */
export function withSingleModel<Namespace, State, Reducers, Effects>(
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
) {
  return (
    SubComponent: React.ComponentType<{
      singleModel: UseModelResult<ModelConfig<Namespace, State, Reducers, Effects>>;
      [key: string]: any;
    }>,
  ) => {
    return React.memo(function WithSingleModelContainer(props: unknown) {
      const singleModel = useSingleModel(modelConfig);
      return <SubComponent {...props} singleModel={singleModel} />;
    });
  };
}

/**
 * 获取指定 model 的 dispatchers 方法
 */
function getDispatchers<S extends Store, Namespace, State, Reducers, Effects>(
  store: S,
  modelConfig: ModelConfig<Namespace, State, Reducers, Effects>,
) {
  const { namespace } = modelConfig;
  const result = {};

  Object.keys(modelConfig.reducers).forEach((key: string) => {
    result[key] = (payload: any) => store.dispatch({ type: `${namespace}/${key}`, payload });
  });

  if (modelConfig.effects) {
    Object.keys(modelConfig.effects).forEach((key) => {
      result[key] = (payload: any) => store.dispatch({ type: `${namespace}/${key}`, payload });
    });
  }

  return result as GetDispatchers<State, Reducers, Effects>;
}
