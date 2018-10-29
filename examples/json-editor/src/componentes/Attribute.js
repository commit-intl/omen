import { omen } from '@omen/core';
import styles from './Attribute.scss';
import InputText from './InputText';
import InputNumber from './InputNumber';
import Object from './Object';
import TypeSelect from './TypeSelect';

const Attribute = ({ key, value }, state, data) => {
  const getType = v => v != null ? typeof v : v + '';
  const type = value.transform(getType);
  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <label>{key}</label>
        <TypeSelect value={value} type={type}/>
      </div>
      {
        value.switch(
          getType,
          {
            'string': v => <InputText value={v}/>,
            'number': v => <InputNumber value={v}/>,
            'object': v => <Object value={v}/>,
            'null': v => <div className={styles.null}>null</div>
          }
        )
      }
    </div>
  );
}

export default Attribute;