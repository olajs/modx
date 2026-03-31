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
  let result: any;

  dispatchers.init();
  await dispatchers.initAsync();
  expect(store.getState()[model.namespace]).toMatchObject({
    counter: 1,
    counting: true,
  });
  dispatchers.setCounting(false);
  await dispatchers.initAsync();

  dispatchers.plus();
  expect(store.getState()[model.namespace].counter).toBe(2);

  dispatchers.minus();
  expect(store.getState()[model.namespace].counter).toBe(1);

  dispatchers.setCounting(true);
  expect(store.getState()[model.namespace].counting).toBe(true);
  dispatchers.setCounting(false);
  expect(store.getState()[model.namespace].counting).toBe(false);

  result = await dispatchers.plusAsync(200);
  expect(result).toBe(2);
  expect(store.getState()[model.namespace].counter).toBe(2);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(2);
      resolve(true);
    }, 200);
  });

  result = await dispatchers.minusAsync(200);
  expect(result).toBe(1);
  expect(store.getState()[model.namespace].counter).toBe(1);
  await new Promise((resolve) => {
    setTimeout(() => {
      expect(store.getState()[model.namespace].counter).toBe(1);
      resolve(true);
    }, 200);
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
