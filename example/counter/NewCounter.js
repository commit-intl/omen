import {omega} from 'ome';
import {store} from './_index';
import styles from './_index.scss';
import {Input} from './Input';
import {Button} from './Button';

export const NewCounter = ({target, value}, data) => {

  let inputChange = (event) => {
    value.set(event.target.value);
  };

  let addCounter = (event) => {
    target.set(
      (data) => {
        const entry = {name: value.get(), value: 0};
        if (!data) {
          return [entry];
        }
        return [...data, entry];
      });

    value.set('');
  };


  return (
    <div className={styles.newCounter}>
      <Input type="text" value={value} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};
