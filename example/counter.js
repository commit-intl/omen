import { omega, DataStore, createDataStoreViewer } from 'omega';
import styles from './counter.scss';

const store =
  new DataStore({
    counters: {
      'Tempus Count': {
        value: 13,
      },
      'Eternal Size': {
        value: -3,
      }
    },
    newCounter: ''
  });

store.addListener('', (data) => console.log('STORE_CHANGE', data));

const Button = ({ value, onClick }) => {
  return <button
    className={styles.button}
    onClick={onClick}>
    {value}
  </button>;
};

const Input = ({type, value, onChange}) => {
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
  let addCounter = () => {
    let newCounter = store.get('newCounter');
    store.set(
      'counters',
      (data) => {
        data[newCounter] = {value: 0};
        return data;
      });

    store.set('newCounter', '');
  };

  return (
    <div className={styles.newCounter}>
      <Input _bind={'newCounter'} type="text" value={data => data} onChange={inputChange}/>
      <Button value="add counter" onClick={addCounter}/>
    </div>
  );
};

omega.render(
  <div className={styles.wrapper}>
    <div _forIn={'counters'}>
        <div className={styles.entry}>
          <div className={styles.remove} onClick={(event, data, path) => store.set(path, undefined)}>×</div>
          <h1 className={styles.title}>{data => data}</h1>
          <Counter path={(data, path) => path+'.value'}/>
        </div>
    </div>
    <NewCounter/>
  </div>,
  document.body,
  store
);

createDataStoreViewer(
  document.body,
  store
);