# changelog

# v3.0.6

- fix: 状态更新去掉 `sameValue` 判断

## v3.0.5

- feat: 为 `effects` 和 `dispatchers` 新增 `getState` 和 `setState` 快捷方法

## v3.0.4

- chore: `effects` 无需泛型

## v3.0.2

- feat: 显示 state 变更日志

## v3.0.1

- feat: `effects` 方法支持泛型类型

## v3.0.0

- feat: 新增 `shareModel`，多个组件可共享局部状态
- feat: 新增 `selector` 函数以减少组件不必要的重复渲染

### BREAKING CHANGES

- `withGlobalModel` 高阶组件传入子组件 `props` 的 `globalModel` 改为 `model`
- `withSingleModel` 高阶组件传入子组件 `props` 的 `singleModel` 改为 `model`

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
