import { createModel } from '@olajs/modx';

const namespace = 'shareModalA';

const defaultValue = 'abc';
export const model = createModel({
  namespace,
  state: {
    value: defaultValue,
    value2: '',
  },
  reducers: {
    setValue: (state, value: string) => ({
      ...state,
      value,
    }),
    setValue2: (state, value2: string) => ({
      ...state,
      value2,
    }),
    reset: (state) => ({
      ...state,
      value: defaultValue,
      value2: '',
    }),
  },
  effects: {
    test1(arg1: string) {
      console.log('test1():', arg1);
    },
    test2() {
      console.log('test2():', 'no parameters');
    },
    async test3() {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('test3():');
          resolve('async no parameters');
        }, 2000);
      });
    },
    async test4(arg1: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('test4():', arg1);
          resolve('async with parameters');
        }, 1000);
      });
    },
  },
});
