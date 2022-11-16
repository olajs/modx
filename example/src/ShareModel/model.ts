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
      console.log(arg1);
    },
    test2() {
      console.log('no parameters');
    },
    async test3() {
      console.log('async no parameters');
    },
    async test4(arg1: number) {
      console.log(arg1);
    },
  },
});
