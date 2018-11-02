import { omen } from '@omen/core';
import styles from './Attribute.scss';
import InputText from '../InputText/InputText';
import InputNumber from '../InputNumber/InputNumber';
import Object from '../Object/Object';
import TypeSelect from '../TypeSelect/TypeSelect';
import InputBoolean from '../InputBoolean/InputBoolean';

const Attribute = ({ key, value, onKeyChange }, state, data) => {
  const getType = v => {
    let type = v != null ? typeof v : v + '';
    if (type === 'object') {
      return Array.isArray(v) ? 'array' : 'object';
    }
    return type;
  };
  const type = value.transform(getType);

  const handleKeyInput = (event, v, key) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.target.blur();
      return true;
    }
  };

  return (
    <div className={value.transform(v => [styles.host, v && typeof v === 'object' ? styles.object : styles.primitive])}>
      <div className={styles.header}>
        <label
          contentEditable={!!onKeyChange}
          onKeyPress={handleKeyInput}
          onBlur={onKeyChange}
        >
          {key}
        </label>
        <div className={styles.actions}>
          <TypeSelect value={value} type={type}/>
          <div
            className={styles.delete}
            onClick={() => value.set(undefined)}
          >
            [delete]
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {
          value.switch(
            getType,
            {
              'string': v => <InputText value={v}/>,
              'number': v => <InputNumber value={v}/>,
              'boolean': v => <InputBoolean value={v}/>,
              'object': v => <Object value={v}/>,
              'array': v => <Object value={v}/>,
              'null': v => <div className={styles.null}>null</div>,
            }
          )
        }
      </div>
    </div>
  );
};

export default Attribute;