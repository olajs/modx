import { connect } from 'react-redux';
import { namespace } from './model';
import Counter from './Counter';

function App(props) {
  return (
    <div>
      <p>{props.counter}</p>
      <button onClick={props.plus}>+</button>
      <button onClick={props.minus}>-</button>
      <p>Async</p>
      <Counter />
    </div>
  );
}

export default connect(
  (state) => state[namespace],
  (dispatch) => ({
    plus() {
      dispatch({ type: `${namespace}/plus` });
    },
    minus() {
      dispatch({ type: `${namespace}/minus` });
    },
  }),
)(App);
