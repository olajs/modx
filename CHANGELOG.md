# changelog

## v2.1.2

- feat: 新增 `useModel` & `withModel` 快捷方法

## v2.1.1

- feat: 支持添加额外的 `redux middleware`

## v2.1.0

- feat: 简化 `reducers` 参数

## v2.0.3

- chore: 添加必要的 `readonly` 修饰符

## v2.0.2

- chore: 优化类型推断

## v2.0.1

- chore: 优化类型推断

## v2.0.0

- feat: 增强类型推断，减少不必要的手动类型声明

### Breaking Changes

- `model` 配置需要通过 `createModel` 方法包裹

  ```javascript
  import { createModel } from '@olajs/modx';
  export default createModel({
    namespace: 'modelA',
    state: { counter: 0 },
    reducers: {
      plus: (state, action) => ({ ...state, counter: action.payload.counter }),
    },
  });
  ```

- `UseGlobalModel` 和 `withGlobalModel` 参数改为传 `model`（1.x 传 `namespace`）
- 不再需要手动声明 `StateType` 和 `Dispatchers` 类型
- `tsconfig.json` 文件需要开启 `"noImplicitThis": true`

## v1.0.4

- fix: fix types

## v1.0.3

- feat: 新增 `useGlobalModel` 和 `withGlobalModel` 方便使用全局状态

## v1.0.2

- feat: `EffectArgs` 参数新增 `prevState` 和 `dispatcher`
  - `prevState` 为当前 `model` 的 `state` 数据
  - `dispatcher` 方法为 `store.dispatch()` 方法的快捷方式

## v1.0.1

- feat: add example

## v1.0.0

first release
