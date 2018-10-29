import {omen} from '@omen/core';
import styles from './InputNumber.scss';

const InputNumber = ({value}) =>
  <input
    type="number"
    className={styles.host}
    value={value}
    onChange={(e) => value.set(parseInt(e.target.value))}
  />;

export default InputNumber;