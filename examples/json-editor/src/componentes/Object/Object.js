import { omen } from '@omen/core';
import Attribute from '../Attribute/Attribute';
import styles from './Object.scss';


const Object = ({ value }) => {

  const handleKeyChange = (event, v, key) => {
    let newKey = event.target.innerText;
    if (newKey !== key) {
      value.set(currentValue => {
        if (Array.isArray(currentValue)) {
          const oldKeyIndex = parseInt(key);
          const newKeyIndex = parseInt(newKey);
          if (!Number.isNaN(newKeyIndex)) {
            currentValue = [...currentValue];
            if (currentValue[newKeyIndex] !== undefined) {
              // DO A FLIP
              let temp = currentValue[newKeyIndex];
              currentValue[newKeyIndex] = v.get();
              currentValue[oldKeyIndex] = temp;
              newKey = oldKeyIndex;
            }
            else {
              // INSERT AT THE END
              currentValue.splice(oldKeyIndex, 1);
              currentValue.push(v.get());
              newKey = oldKeyIndex;
            }
          }
        }
        else {
          currentValue = {...currentValue};
          if(currentValue[newKey] !== undefined) {
            // FLIP VALUES
            let temp = currentValue[newKey];
            currentValue[newKey] = v.get();
            currentValue[key] = temp;
            newKey = key;
          }
          else {
            // CHANGE NAME
            delete currentValue[key];
            currentValue[newKey] = v.get();
          }
        }

        return currentValue;
      });

      // FORCE NEW NAME INTO FIELD
      event.target.innerText = newKey;
    }

  };
  const handleAdd = (event) => {
    value.set((currentValue) => {
      if (Array.isArray(currentValue)) {
        return [
          ...currentValue,
          null,
        ];
      }
      else {
        return {
          ...currentValue,
          unnamed: null,
        };
      }
    })
  };

  return (
    <div className={styles.host}>
      {
        value
        && value.map(
          (value, key) =>
            <Attribute
              value={value}
              key={key}
              onKeyChange={(event) => handleKeyChange(event, value, key)}
            />
        )
      }
      <button className={styles.add} onClick={handleAdd}>+</button>
    </div>
  );
};

export default Object;