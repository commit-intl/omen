import { omega } from 'omega';
import styles from './_index.scss';

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