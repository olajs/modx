import { createSingleStore, createStore, getDispatchers } from '@olajs/modx';
import model from './model';

const store = createSingleStore(model);

it('initial state', () => {
  const gStore = createStore(
    {
      modelA: { counter: 0, counting: false },
    },
    [model],
  );
  expect(gStore.getState()[model.namespace]).toMatchObject({
    counter: 0,
    counting: false,
  });
});

it('test dispatchers', async () => {
  const dispatchers = getDispatchers(store, model);

  dispatchers.init();
  expect(store.getState()[model.namespace]).toMatchObject({
    counter: 1,
    counting: true,
  });

  dispatchers.plus();
  expect(store.getState()[model.namespace].counter).toBe(2);

  dispatchers.minus();
  expect(store.getState()[model.namespace].counter).toBe(1);

  dispatchers.setCounting(true);
  expect(store.getState()[model.namespace].counting).toBe(true);
  dispatchers.setCounting(false);
  expect(store.getState()[model.namespace].counting).toBe(false);

  dispatchers.plusAsync(1000);
  expect(store.getState()[model.namespace].counter).toBe(1);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(2);
      resolve(true);
    }, 1000);
  });

  dispatchers.minusAsync(1000);
  expect(store.getState()[model.namespace].counter).toBe(2);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(1);
      resolve(true);
    }, 1000);
  });

  dispatchers.setState({
    counter: 1,
    counting: false,
  });
  expect(dispatchers.getState()).toMatchObject({
    counter: 1,
    counting: false,
  });
});
