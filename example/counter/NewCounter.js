import {omega} from 'ome';
import {store} from './_index';
import styles from './_index.scss';
import {Input} from './Input';
import {Button} from './Button';

export const NewCounter = (props, {counters, value}) => {

  let inputChange = (event) => {
    console.log(value);
    value.set(event.target.value);
  };

  let addCounter = (event) => {
    counters.set(
      (data) => {
        console.log(data, value, value.get());
        if (!data) {
          data = [];
        }
        data.push({name: value.get(), value: 0});
        return data;
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

NewCounter.data = ({list}) => ({
  counters: list.child('counters'),
  value: list.child('newCounter'),
});