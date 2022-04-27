import { createStore, compose, applyMiddleware, combineReducers, Middleware, Reducer } from 'redux';
import { Store } from './types';

/**
 * 开发环境的 store
 */
function configureStoreDev({
  initialState,
  reducers,
  middlewares = [],
  devTools = false,
}: {
  initialState: any;
  reducers: { [key: string]: Reducer };
  middlewares: Middleware[];
  devTools?: boolean;
}): Store {
  // add support for Redux dev tools
  const composeEnhancers = (devTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return createStore(
    combineReducers(reducers),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
}

/**
 * 生产环境的 store
 */
function configureStoreProd({
  initialState,
  reducers,
  middlewares = [],
}: {
  middlewares: Middleware[];
  reducers: { [key: string]: Reducer };
  initialState: any;
  devTools?: boolean;
}): Store {
  return createStore(
    combineReducers(reducers),
    initialState,
    compose(applyMiddleware(...middlewares)),
  );
}

export default process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;
