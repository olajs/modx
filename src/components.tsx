import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { ModelConfig, Store, GetDispatchers } from './types';
import { sameValue } from './utils';
import { createSingleStore } from '.';

enum StoreType {
  // 全局 store
  Global,
  // 单组件 store
  Single,
  // 多组件共享 store
  Share,
  // 通过 namespace 自动判断是，Global 有则使用 Global，否则使用 Single
  Auto,
}

type SelectorFunction<State, ReturnValue = null> = (state: State) => ReturnValue;

// 构建默认的 Selector ReturnValue
type DefaultReturnValue<T extends ModelConfig, Selector> = Selector extends SelectorFunction<
  T['state'],
  infer Val
>
  ? Val
  : T['state'];

/**
 * 构建指定 Model 和 Selector 的 useXXX hooks 返回值
 */
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

// 缓存已创建过的 store
const storeMap = new WeakMap<ModelConfig, Store>();

/**
 * 公共的 hooks，共 useXXModel 使用
 */
function useModelCommon<
  T extends ModelConfig,
  Selector extends SelectorFunction<T['state'], ReturnValue> | null | undefined,
  ReturnValue = DefaultReturnValue<T, Selector>,
>(storeType: StoreType, modelConfig: T, selector?: Selector) {
  const { namespace } = modelConfig;

  // 创建 store，默认使用全局 store
  let storeGlobal;
  try {
    storeGlobal = useStore();
  } catch (e) {}

  const [store] = useState(() => {
    let initStore: Store = storeGlobal;
    // 自动判断是全局 model 还是组件内部 model
    if (storeType === StoreType.Auto) {
      if (storeGlobal && namespace in storeGlobal.getState()) {
        initStore = storeGlobal;
      } else {
        initStore = createSingleStore(modelConfig);
      }
    } else if (storeType === StoreType.Single) {
      initStore = createSingleStore(modelConfig);
    } else if (storeType === StoreType.Share) {
      initStore = storeMap.get(modelConfig) || createSingleStore(modelConfig);
      if (!storeMap.has(modelConfig)) {
        storeMap.set(modelConfig, initStore);
      }
    }
    return initStore;
  });

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
      setState((oldState) => (sameValue(oldState, newState) ? oldState : newState));
    });
  }, [store]);

  return { store, state, dispatchers };
}

/**
 * 公共 withXXXModel，包装一个拥有指定 modelConfig 的状态的组件
 */
function withModelCommon<T extends ModelConfig, ReturnValue = null>(
  storeType: StoreType,
  modelConfig: T,
  selector?: SelectorFunction<T['state'], ReturnValue>,
) {
  return <OwnProps,>(
    SubComponent: React.ComponentType<
      OwnProps & {
        model: UseModelResult<T, typeof selector>;
      }
    >,
  ) =>
    React.memo(function withGlobalModelContainer(props: OwnProps) {
      const model = useModelCommon<T, typeof selector, ReturnValue>(
        storeType,
        modelConfig,
        selector,
      );
      return <SubComponent {...props} model={model} />;
    });
}

/**
 * 获取指定 modelConfig 的状态的 hooks，优先从全局状态找，找不到则创建一个单组件状态
 */
export function useModel<
  T extends ModelConfig,
  Selector extends SelectorFunction<T['state'], ReturnValue> | null | undefined,
  ReturnValue = DefaultReturnValue<T, Selector>,
>(modelConfig: T, selector?: Selector) {
  return useModelCommon<T, Selector, ReturnValue>(StoreType.Auto, modelConfig, selector);
}

/**
 * 包装一个拥有指定 modelConfig 的状态的组件，优先从全局状态找，找不到则创建一个单组件状态
 */
export function withModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector?: SelectorFunction<T['state'], ReturnValue>,
) {
  return withModelCommon(StoreType.Auto, modelConfig, selector);
}

/**
 * 获取指定 modelConfig 的全局状态的 hooks
 */
export function useGlobalModel<
  T extends ModelConfig,
  Selector extends SelectorFunction<T['state'], ReturnValue> | null | undefined,
  ReturnValue = DefaultReturnValue<T, Selector>,
>(modelConfig: T, selector?: Selector) {
  return useModelCommon<T, Selector, ReturnValue>(StoreType.Global, modelConfig, selector);
}

/**
 * 包装一个拥有指定 modelConfig 的全局状态的组件
 */
export function withGlobalModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector?: SelectorFunction<T['state'], ReturnValue>,
) {
  return withModelCommon(StoreType.Global, modelConfig, selector);
}

/**
 * 获取指定 modelConfig 的单组件状态的 hooks
 */
export function useSingleModel<
  T extends ModelConfig,
  Selector extends SelectorFunction<T['state'], ReturnValue> | null | undefined,
  ReturnValue = DefaultReturnValue<T, Selector>,
>(modelConfig: T, selector?: Selector) {
  return useModelCommon<T, Selector, ReturnValue>(StoreType.Single, modelConfig, selector);
}

/**
 * 为 Class Component 包装一个单组件状态 singleModel
 */
export function withSingleModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector?: SelectorFunction<T['state'], ReturnValue>,
) {
  return withModelCommon(StoreType.Single, modelConfig, selector);
}

/**
 * 获取指定 modelConfig 的共享状态的 hooks，可用在非全局 state 模式下几个组件共享状态的场景中
 */
export function useShareModel<
  T extends ModelConfig,
  Selector extends SelectorFunction<T['state'], ReturnValue> | null | undefined,
  ReturnValue = DefaultReturnValue<T, Selector>,
>(modelConfig: T, selector?: Selector) {
  return useModelCommon<T, Selector, ReturnValue>(StoreType.Share, modelConfig, selector);
}

/**
 * 为 Class Component 包装一个共享组件状态 shareModel，可用在非全局 state 模式下几个组件共享状态的场景中
 */
export function withShareModel<T extends ModelConfig, ReturnValue = null>(
  modelConfig: T,
  selector?: SelectorFunction<T['state'], ReturnValue>,
) {
  return withModelCommon(StoreType.Share, modelConfig, selector);
}

/**
 * 获取指定 model 的 dispatchers 方法
 */
export function getDispatchers<S extends Store, T extends ModelConfig>(store: S, modelConfig: T) {
  const { namespace } = modelConfig;
  const result = {
    getState(): T['state'] {
      return store.getState()[namespace];
    },
    setState(state: Partial<T['state']>) {
      store.dispatch({ type: `${namespace}/setState`, payload: state });
    },
  };

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
