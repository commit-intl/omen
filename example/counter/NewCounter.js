import { omega } from 'omega';
import { store } from './_index';
import styles from './_index.scss';
import { Input } from './Input';
import { Button } from './Button';

export const NewCounter = () => {
  let inputChange = (event, data, path) => {
    store.set(path, event.target.value)
  };
  let addCounter = (event, data, path) => {
    let newCounter = store.get(path+'.newCounter');
    store.set(
      path+'.counters',
      (data) => {
        data.push({ name: newCounter, value: 0 });
        return data;
      });

    store.set('newCounter', '');
  };

  return (
    <div className={styles.newCounter}>
      <Input _bind={(data, path) => path+'.newCounter'} type="text" value={data => data} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};