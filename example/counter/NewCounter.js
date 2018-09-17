import {omega} from 'ome';
import {store} from './_index';
import styles from './_index.scss';
import {Input} from './Input';
import {Button} from './Button';

export const NewCounter = ({target}, state, data) => {

  let inputChange = (event) => {
    state.set(event.target.value);
  };

  let addCounter = (event) => {
    target.set(
      (data) => {
        const entry = {name: state.get(), value: 0};
        if (!data) {
          return [entry];
        }
        return [...data, entry];
      });

    state.set('');
  };


  return (
    <div className={styles.newCounter}>
      <Input type="text" value={state} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};


NewCounter.initialState = '';