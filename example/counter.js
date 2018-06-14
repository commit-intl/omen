import { omega, DataStore, createDataStoreViewer } from 'omega';
import styles from './counter.scss';

const store =
  new DataStore({
      'Important': {
        counters: [
          {
            name: 'Tempus Count',
            value: 13,
          },
          {
            name: 'Eternal Size',
            value: -3,
          }
        ],
        newCounter: '',
      },
      'Unnecessary': {
        counters: [
          {
            name: 'Memes Created',
            value: 13,
          },
          {
            name: 'Lifes Changed',
            value: 0,
          }
        ],
        newCounter: '',
      }
  });

store.addListener('', (data) => console.log('STORE_CHANGE', data));

const Button = ({ value, onClick }) => {
  return <button
    className={styles.button}
    onClick={onClick}>
    {value}
  </button>;
};

const Input = ({ type, value, onChange }) => {
  return (
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={onChange}
    />
  )
};

const Counter = ({ path }) => {
  let buttonClick = (value) => (event, data, path) => {
    store.set(path, (data) => data + value)
  };
  let inputChange = (event, data, path) => {
    store.set(path, parseInt(event.target.value) || 0)
  };
  return (
    <div _bind={path} className={styles.counter}>
      <Button value="-5" onClick={buttonClick(-5)}/>
      <Button value="-1" onClick={buttonClick(-1)}/>
      <Input type="number" value={data => data} onChange={inputChange}/>
      <Button value="+1" onClick={buttonClick(+1)}/>
      <Button value="+5" onClick={buttonClick(+5)}/>
    </div>
  );
};

const NewCounter = () => {
  let inputChange = (event, data, path) => {
    store.set(path, event.target.value)
  };
  let addCounter = (event, data, path) => {
    let newCounter = store.get(path+'.newCounter');
    store.set(
      path+'.counters',
      (data) => {
        data.push({ name: newCounter, value: 0 });
        return data;
      });

    store.set('newCounter', '');
  };

  return (
    <div className={styles.newCounter}>
      <Input _bind={(data, path) => path+'.newCounter'} type="text" value={data => data} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};

omega.render(
  <div className={styles.wrapper}>
    <div _for={''}>
      <div className={styles.group}>
        <h1 className={styles.groupTitles}>{(data, path) => path && path.replace(/^.*\./, '')}</h1>
        <div _for={(data, path) => path+'.counters'}>
          <div className={styles.entry}>
            <div className={styles.remove} onClick={(event, data, path) => store.set(path, undefined)}>×</div>
            <h2 className={styles.title}>{data => data && data.name}</h2>
            <Counter path={(data, path) => path + '.value'}/>
          </div>
        </div>
        <NewCounter/>
      </div>
    </div>
  </div>,
  document.body,
  store
);

createDataStoreViewer(
  document.body,
  store
);