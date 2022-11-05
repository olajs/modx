import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { ModelConfig, Store, GetDispatchers } from './types';
import { sameValue } from './utils';
import { createSingleStore } from '.';

export type SelectorFunction<State, ReturnValue = null> = (state: State) => ReturnValue;

export type UseModelResult<T extends ModelConfig, Selector = null> = Readonly<{
  store: Store;
  state: Readonly<
    Selector extends SelectorFunction<T['state'], infer ReturnValue>
      ? ReturnValue extends null
        ? T['state']
        : ReturnValue
      : T['state']
  >;
  dispatchers: GetDispatchers<T['state'], T['reducers'], T['effects']>;
}>;

/**
 * 获取指定 modelConfig 的状态的 hooks
 */
export function useModel<T extends ModelConfig>(modelConfig: T): UseModelResult<T> {
  const { namespace } = modelConfig;

  // 自动判断是全局 model 还是组件内部 model
  const storeGlobal = useStore();
  const [store] = useState(() => {
    if (namespace in storeGlobal.getState()) {
      return storeGlobal;
    }
    return createSingleStore(modelConfig);
  });

  const [state, setState] = useState<T['state']>(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 包装一个拥有指定 modelConfig 的状态的组件
 */
export function withModel<T extends ModelConfig>(modelConfig: T) {
  return <OwnProps,>(
    SubComponent: React.ComponentType<
      OwnProps & {
        model: UseModelResult<T>;
      }
    >,
  ) =>
    React.memo(function withGlobalModelContainer(props: OwnProps) {
      const model = useModel(modelConfig);
      return <SubComponent {...props} model={model} />;
    });
}

/**
 * 获取指定 modelConfig 的全局状态的 hooks
 */
export function useGlobalModel<T extends ModelConfig>(modelConfig: T): UseModelResult<T> {
  const { namespace } = modelConfig;
  const store = useStore();
  const [state, setState] = useState<T['state']>(store.getState()[namespace]);
  const [dispatchers] = useState(() => getDispatchers(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => setState(store.getState()[namespace]));
  }, []);

  return { store, state, dispatchers };
}

/**
 * 包装一个拥有指定 modelConfig 的全局状态的组件
 */
export function withGlobalModel<T extends ModelConfig>(modelConfig: T) {
  return <OwnProps,>(
    SubComponent: React.ComponentType<
      OwnProps & {
        globalModel: UseModelResult<T>;
      }
    >,
  ) =>
    React.memo(function withGlobalModelContainer(props: OwnProps) {
      const globalModel = useGlobalModel(modelConfig);
      return <SubComponent {...props} globalModel={globalModel} />;
    });
}

/**
 * modelConfig 转 React hooks
 */
export function useSingleModel<T extends ModelConfig>(modelConfig: T): UseModelResult<T> {
  const [store] = useState(createSingleStore(modelConfig));
  const [state, setState] = useState<T['state']>(store.getState()[modelConfig.namespace]);
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
export function withSingleModel<T extends ModelConfig>(modelConfig: T) {
  return <OwnProps,>(
    SubComponent: React.ComponentType<
      OwnProps & {
        singleModel: UseModelResult<T>;
      }
    >,
  ) => {
    return React.memo(function WithSingleModelContainer(props: OwnProps) {
      const singleModel = useSingleModel(modelConfig);
      return <SubComponent {...props} singleModel={singleModel} />;
    });
  };
}

// 缓存已创建过的 store
const storeMap = new WeakMap<ModelConfig, Store>();

/**
 * 使用一个共享的 model，可用在非全局 state 模式下几个组件共享状态的场景中
 */
export function useShareModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector: SelectorFunction<T['state'], ReturnValue> | null = null,
): UseModelResult<T, typeof selector> {
  const { namespace } = modelConfig;

  // 如果 store 不存在，则创建一个
  let store: Store = storeMap.get(modelConfig) || createSingleStore(modelConfig);
  if (!storeMap.has(modelConfig)) {
    storeMap.set(modelConfig, store);
  }

  const [state, setState] = useState<ReturnValue extends null ? T['state'] : ReturnValue>(
    selector && typeof selector === 'function'
      ? selector(store.getState()[namespace])
      : store.getState()[namespace],
  );
  const [dispatchers] = useState(() => getDispatchers(store, modelConfig));
  useEffect(() => {
    return store.subscribe(() => {
      const newState =
        selector && typeof selector === 'function'
          ? selector(store.getState()[namespace])
          : store.getState()[namespace];
      if (!sameValue(state, newState)) {
        setState(newState);
      }
    });
  }, [state]);

  return { store, state, dispatchers };
}

/**
 * 为 Class Component 包装一个 shareModel
 */
export function withShareModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector: SelectorFunction<T['state'], ReturnValue> | null = null,
) {
  return <OwnProps,>(
    SubComponent: React.ComponentType<
      OwnProps & {
        shareModel: UseModelResult<T, typeof selector>;
      }
    >,
  ) =>
    React.memo(function withShareModelContainer(props: OwnProps) {
      const shareModel = useShareModel(modelConfig, selector);
      return <SubComponent {...props} shareModel={shareModel} />;
    });
}

/**
 * 获取指定 model 的 dispatchers 方法
 */
export function getDispatchers<S extends Store, T extends ModelConfig>(store: S, modelConfig: T) {
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

  return result as GetDispatchers<T['state'], T['reducers'], T['effects']>;
}
