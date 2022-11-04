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
    reset: () => ({
      value: defaultValue,
      value2: '',
    }),
  },
});
