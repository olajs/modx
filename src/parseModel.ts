import { ModelConfig } from './types';
import { Middleware, Reducer } from 'redux';

// 要注入的 effects 的 this 属性
const EFFECT_THIS_KEYS = ['namespace', 'store', 'next', 'prevState', 'dispatcher'];

/**
 * 创建一个 reducer，将其 action 与 subject 相关联
 */
function createReducer({ namespace, reducers = {}, state: initialState }): Reducer {
  const converted = {};

  Object.keys(reducers).forEach((actionType: string) => {
    if (EFFECT_THIS_KEYS.includes(actionType)) {
      throw new Error(`[modx: ${namespace}] reducers can not have method named "${actionType}"`);
    }
    converted[`${namespace}/${actionType}`] = reducers[actionType];
  });

  return function (state = initialState, action) {
    if (converted.hasOwnProperty(action.type)) {
      return converted[action.type](state, action);
    }

    return state;
  };
}

/**
 * 将 effects 解析成 redux middleware
 */
function createMiddleware({ namespace, reducers = {}, effects = {} }: ModelConfig): Middleware {
  const converted = {};

  Object.keys(effects).forEach((actionType) => {
    if (EFFECT_THIS_KEYS.includes(actionType)) {
      throw new Error(`[modx: ${namespace}] effects can not have method named "${actionType}"`);
    }
    converted[`${namespace}/${actionType}`] = effects[actionType];
  });

  return (store) => (next) => (action) => {
    next(action);
    if (converted.hasOwnProperty(action.type)) {
      // 为 effects 的 this 变量注入额外的内容
      const thisType = {
        namespace,
        store,
        next,
        // 将当前 model 的 state 直接获取了传参，方便开发人员获取
        prevState: store.getState()[namespace],
        // 简化 store.dispatch() 方法的调用
        dispatcher(actionType: string, payload?: any) {
          store.dispatch({ type: actionType, payload });
        },
      };
      // reducers 的快捷方法
      Object.keys(reducers).forEach((key) => {
        thisType[key] = (payload: any) => {
          store.dispatch({ type: `${namespace}/${key}`, payload });
        };
      });
      // effects 的快捷方法
      Object.keys(effects).forEach((key) => {
        thisType[key] = (payload: any) => {
          store.dispatch({ type: `${namespace}/${key}`, payload });
        };
      });
      converted[action.type].call(thisType, action.payload);
    }
  };
}

/**
 * 解析 model 数据
 */
export default function parseModel(modelConfig: ModelConfig): {
  reducer: Reducer;
  middleware: Middleware;
} {
  const { namespace, reducers = {}, effects = {} } = modelConfig;
  Object.keys(reducers).forEach((key) => {
    if (effects.hasOwnProperty(key)) {
      throw new Error(`[modx: ${namespace}] method "${key}" defined in both reducers and effects`);
    }
  });
  return {
    reducer: createReducer(modelConfig),
    middleware: createMiddleware(modelConfig),
  };
}
