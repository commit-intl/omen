import { omega, DataStore, _o, createDataStoreViewer } from 'omega';
import styles from './counter.scss';

const store =
  new DataStore({
    counters: {
      'Tempus Count': {
        value: 0,
      },
      'Eternal Size': {
        value: 0,
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
    <div className={styles.counter}>
      <_o bind={path}>
        <Button value="-5" onClick={buttonClick(-5)}/>
        <Button value="-1" onClick={buttonClick(-1)}/>
        <Input type="number" value={data => data} onChange={inputChange}/>
        <Button value="+1" onClick={buttonClick(+1)}/>
        <Button value="+5" onClick={buttonClick(+5)}/>
      </_o>
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
        <_o bind={'newCounter'} >
          <Input type="text" value={data => data} onChange={inputChange}/>
        </_o>
        <Button value="add counter" onClick={addCounter}/>
      </div>
  );
};

omega.render(
  <div className={styles.wrapper}>
    <_o forIn={'counters'}>
      <h1 className={styles.title}>{data => data}</h1>
      <Counter path={(data) => `${data}.value`}/>
    </_o>
    <NewCounter/>
  </div>,
  document.body,
  store
);

createDataStoreViewer(
  document.body,
  store
);