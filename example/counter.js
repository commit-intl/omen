import { omega, DataStore, _o } from 'omega';
import styles from './counter.scss';

const store =
  new DataStore({
    'Foo Counter': {
      value: 0,
    },
    'Baa Counter': {
      value: 0,
    }
  });

store.addListener('', (data) => console.log('STORE_CHANGE', data));

const Button = ({ value }) => {
  return <button
    className={styles.button}
    onClick={(event, path) => {
      console.log(path);
      store.set(path, (data) => data + value)
    }}>
    {(value > 0 ? '+' : '') + value}
  </button>;
};

const Input = ({ path }) => {
  return (
    <input
      type="number"
      style={{ border: '2 solid orange', fontSize: '16px', padding: '10px' }}
      value={(data) => data}
      onChange={(event, path) => {
        console.log(path);
        store.set(path, parseInt(event.target.value) || 0)
      }}
    />
  )
};

const Counter = ({path}) => {
  return (
    <div>
      <_o bind={path}>
        <Button value={-5} path={path}/>
        <Button value={-1} path={path}/>
        <Input path={path}/>
        <Button value={+1} path={path}/>
        <Button value={+5} path={path}/>
        <div className={styles.display}>
          {(data) => data}
        </div>
      </_o>
    </div>
  );
};

omega.render(
  <div className={styles.wrapper}>
    <_o forIn={''}>
      <h1>{data => data}</h1>
      <Counter path={data => (data) => `${data}.value`}/>
    </_o>
  </div>,
  store
);