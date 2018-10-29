import { omen } from '@omen/core';
import styles from './TypeSelect.scss';

const TypeSelect = ({ value, type }) => {
  return (
    <select
      className={styles.host}
      onChange={(e) => console.log('TODO: CHANGE TYPE TO '+e.target.options[e.target.selectedIndex].text)}
    >
      <option selected={type.transform(type => type === 'string' ? true : undefined)}>string</option>
      <option selected={type.transform(type => type === 'number' ? true : undefined)}>number</option>
      <option selected={type.transform(type => type === 'boolean' ? true : undefined)}>boolean</option>
      <option selected={type.transform(type => type === 'object' ? true : undefined)}>object</option>
      <option selected={type.transform(type => type === 'array' ? true : undefined)}>array</option>
      <option selected={type.transform(type => type === 'null' ? true : undefined)}>null</option>
    </select>
  );
};


export default TypeSelect;