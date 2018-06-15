import { omega } from 'omega';
import { store } from './_index';
import styles from './_index.scss';
import { Button } from './Button';
import { Input } from './Input';

export const Counter = ({ path }) => {
  let buttonClick = (value) => (event, data, path) => {
    store.set(path, (data) => data + value)
  };
  let inputChange = (event, data, path) => {
    store.set(path, parseInt(event.target.value) || 0)
  };
  return (
    <div _bind={path} className={styles.counter}>
      <Button value="-5" onClick={buttonClick(-5)}/>
      <Button value="-1" onClick={buttonClick(-1)}/>
      <Input type="number" value={data => data} onChange={inputChange}/>
      <Button value="+1" onClick={buttonClick(+1)}/>
      <Button value="+5" onClick={buttonClick(+5)}/>
    </div>
  );
};