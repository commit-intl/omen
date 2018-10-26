import { omen } from '@omen/core';
import styles from '../index.scss';

export const Input = ({ type, value, onChange }) => {
  return (
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={onChange}
    />
  )
};