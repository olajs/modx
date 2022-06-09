import { createModel } from '..';

const namespace = 'modelA';

const model = createModel({
  namespace,
  state: {
    counter: 0,
    counting: false,
  },
  reducers: {
    setCounting: (state, action) => ({
      ...state,
      counting: action.payload?.counting || state.counting,
    }),
    plus: (state) => ({ ...state, counter: state.counter + 1 }),
    minus: (state) => ({ ...state, counter: state.counter - 1 }),
  },
  effects: {
    plusAsync({ timeout }: { timeout: number }) {
      const { counting } = this.prevState;
      if (counting) return;

      console.log(typeof this.minusAsync);

      this.setCounting({ counting: true });
      setTimeout(() => {
        this.plus();
        this.setCounting({ counting: false });
      }, timeout);
    },
    minusAsync({ timeout }: { timeout: number }) {
      const { counting } = this.prevState;
      if (counting) return;

      this.setCounting({ counting: true });
      setTimeout(() => {
        this.minus();
        this.setCounting({ counting: false });
      }, timeout);
    },
  },
});

export { namespace };
export default model;
