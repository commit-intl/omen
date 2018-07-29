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
    let newCounter = store.get(path);
    store.set(
      path.replace('newCounter','counters'),
      (data) => {
        data.push({ name: newCounter, value: 0 });
        return data;
      });

    store.set(path, '');
  };

  return (
    <div _bind={(data, path) => path+'.newCounter'} className={styles.newCounter}>
      <Input type="text" value={data => data} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};