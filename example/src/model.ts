import { createModel, ModelAction } from '@olajs/modx';

export type State = {
  counter: number;
  counting: boolean;
};
export const namespace = 'modelA';

const model = createModel({
  namespace,
  state: {
    counter: 0,
    counting: false,
  } as State,
  reducers: {
    setCounting: (state: State, action: ModelAction<State>) => ({
      ...state,
      counting: action.payload.counting,
    }),
    plus: (state: State) => ({ ...state, counter: state.counter + 1 }),
    minus: (state: State) => ({ ...state, counter: state.counter - 1 }),
  },
  effects: {
    plusAsync({ timeout }: { timeout: number }) {
      const { counting } = this.prevState;
      if (counting) return;

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

export default model;
