import {omen} from '@omen/core';
import styles from './InputBoolean.scss';

const InputBoolean = ({value}) =>
  <input
    type='checkbox'
    className={styles.host}
    checked={value}
    onChange={(e) => value.set(!!e.target.checked)}
  />;

export default InputBoolean;