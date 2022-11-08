import { createSingleStore, createStore, getDispatchers } from '@olajs/modx';
import model from './model';

const store = createSingleStore(model);

it('initial state', () => {
  const gStore = createStore(
    {
      modelA: { counter: 1, counting: true },
    },
    [model],
  );
  expect(gStore.getState()[model.namespace]).toMatchObject({
    counter: 1,
    counting: true,
  });
});

it('test dispatchers', async () => {
  const dispatchers = getDispatchers(store, model);

  dispatchers.plus();
  expect(store.getState()[model.namespace].counter).toBe(1);

  dispatchers.minus();
  expect(store.getState()[model.namespace].counter).toBe(0);

  dispatchers.setCounting(true);
  expect(store.getState()[model.namespace].counting).toBe(true);
  dispatchers.setCounting(false);
  expect(store.getState()[model.namespace].counting).toBe(false);

  dispatchers.plusAsync(1000);
  expect(store.getState()[model.namespace].counter).toBe(0);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(1);
      resolve(true);
    }, 1000);
  });

  dispatchers.minusAsync(1000);
  expect(store.getState()[model.namespace].counter).toBe(1);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(0);
      resolve(true);
    }, 1000);
  });
});
