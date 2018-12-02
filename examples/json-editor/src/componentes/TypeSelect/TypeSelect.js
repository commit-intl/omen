import {omen} from '@omen/core';
import styles from './TypeSelect.scss';

const changeType = (value, type, newType) => {
  const prevType = type.get();
  if (newType !== prevType) {

    let failed = false;

    value.set((currentVal) => {
      let newValue;
      switch (newType) {
        case 'string':
          if (prevType === 'object' || prevType === 'array') {
            return JSON.stringify(currentVal, null, 2);
          }
          return `${currentVal}`;
        case 'number':
          if (prevType === 'string' && /^(\d+\.?\d*|\d*\.\d+)$/.test(currentVal)) {
            try {
              return parseFloat(currentVal);
            } catch (e) {
              // DO NOTHING
            }
          }
          else if (prevType === 'boolean') {
            return currentVal ? 1 : 0;
          }
          newValue = 0;
          break;
        case 'boolean':
          newValue = !!currentVal;
          break;
        case 'object':
          if (prevType === 'string' && /^\s*\{(.|\n)*\}\s*$/.test(currentVal)) {
            try {
              return JSON.parse(currentVal);
            } catch (e) {
              // DO NOTHING
            }
          }
          newValue = {};
          break;
        case 'array':
          if (prevType === 'string' && /^\s*\[(.|\n)*\]\s*$/.test(currentVal)) {
            try {
              return JSON.parse(currentVal);
            } catch (e) {
              // DO NOTHING
            }
          }
          newValue = [];
          break;
        case 'null':
          newValue = null;
          break;
      }

      const result = confirm(`Warning: Changing from ${prevType} to ${newType} will delete the current value!\n\n Continue anyway?`);
      failed = !result;
      return result ? newValue : currentVal;
    });

    if (failed) {
      console.log('failed');
      type.notify(false, false);
    }
  }
};


const TypeSelect = ({value, type}) => {
  const isSelected = (v) => type.transform(type => type === v ? styles.selected : undefined);
  const Option = (props) =>
    <div
      className={isSelected(props.type)}
      onClick={() => changeType(value, type, props.type)}>
      {props.type}
    </div>;

  return (
    <div className={styles.host}>
      <div className={styles.value}>{type}</div>
      <div className={styles.options}>
        <Option type="string"/>
        <Option type="number"/>
        <Option type="boolean"/>
        <Option type="object"/>
        <Option type="array"/>
        <Option type="null"/>
      </div>
    </div>
  );
};


export default TypeSelect;