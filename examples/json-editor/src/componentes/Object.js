import { omen } from '@omen/core';
import Attribute from './Attribute';
import styles from './Object.scss';

const Object = ({ value }) =>
  <div className={styles.host}>
    {
      value && value.map((value, key) => <Attribute value={value} key={key} />)
    }
  </div>;

export default Object;