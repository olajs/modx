import { ModelConfig, EffectFunction } from './types';
import { Middleware, Reducer } from 'redux';

/**
 * 创建一个 reducer，将其 action 与 subject 相关联
 */
function createReducer(
  namespace: string,
  reducers: { [reducerName: string]: Reducer },
  initialState: any,
): Reducer {
  const converted = {};

  Object.keys(reducers).forEach((actionType: string) => {
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
function createMiddleware(
  effects: { [key: string]: EffectFunction },
  { namespace }: { namespace: string },
): Middleware {
  const converted = {};

  Object.keys(effects).forEach((actionType) => {
    converted[`${namespace}/${actionType}`] = effects[actionType];
  });

  return (store) => (next) => (action) => {
    next(action);
    if (converted.hasOwnProperty(action.type)) {
      converted[action.type]({ namespace, store, next, action });
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
  const { namespace, state, reducers, effects } = modelConfig;

  let parsedReducer;
  if (reducers) {
    parsedReducer = createReducer(namespace, reducers, state);
  }

  let middleware;
  if (effects) {
    middleware = createMiddleware(effects, { namespace });
  }

  return { reducer: parsedReducer, middleware };
}
