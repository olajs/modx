import { createModel } from '@olajs/modx';

export const namespace = 'modelB';

const model = createModel({
  namespace,
  state: {
    counter: 0,
    counting: false,
  },
  reducers: {
    setCounting: (state, counting: boolean) => ({
      ...state,
      counting,
    }),
    plus: (state) => ({ ...state, counter: state.counter + 1 }),
    minus: (state) => ({ ...state, counter: state.counter - 1 }),
  },
  effects: {
    plusAsync(timeout: number) {
      const { counting } = this.prevState;
      if (counting) return;

      console.log(typeof this.minusAsync);

      this.setCounting(true);
      setTimeout(() => {
        this.plus();
        this.setCounting(false);
      }, timeout);
    },
    minusAsync(timeout: number) {
      const { counting } = this.prevState;
      if (counting) return;

      this.setCounting(true);
      setTimeout(() => {
        this.minus();
        this.setCounting(false);
      }, timeout);
    },
  },
});

export default model;
