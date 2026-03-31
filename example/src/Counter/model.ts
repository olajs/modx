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
    async init() {
      console.log('after plusAsync():', await this.plusAsync(2000));
      console.log('after minusAsync():', await this.minusAsync(1000));
    },
    plusAsync(timeout: number) {
      const { counting } = this.prevState;
      if (counting) return;

      console.log(typeof this.minusAsync);

      this.setCounting(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          this.plus();
          this.setCounting(false);
          resolve(this.getState().counter);
        }, timeout);
      });
    },
    minusAsync(timeout: number) {
      const { counting } = this.prevState;
      if (counting) return;

      this.setCounting(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          this.minus();
          this.setCounting(false);
          resolve(this.getState().counter)
        }, timeout);
      });
    },
  },
});

export default model;
