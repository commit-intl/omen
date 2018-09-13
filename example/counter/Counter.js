import { omega } from 'ome';
import { store } from './_index';
import styles from './_index.scss';
import { Button } from './Button';
import { Input } from './Input';

export const Counter = ({ value }) => {
  let buttonClick = (changeValue) => (event) => {
    value.set((data) => (data || 0) + changeValue);
  };
  let inputChange = (event) => {
    value.set(parseInt(event.target.value) || 0);
  };
  return (
    <div className={styles.counter}>
      <Button value="-5" onClick={buttonClick(-5)}/>
      <Button value="-1" onClick={buttonClick(-1)}/>
      <Input type="number" value={value} onChange={inputChange}/>
      <Button value="+1" onClick={buttonClick(+1)}/>
      <Button value="+5" onClick={buttonClick(+5)}/>
    </div>
  );
};