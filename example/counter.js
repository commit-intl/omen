import omega from 'omega/omega';
import DataStore from 'omega/data';
import styles from './counter.scss';

const store =
  new DataStore({
    counter_a: {
      value: 0,
    },
    counter_b: {
      value: 0,
    }
  });

const Button = ({ value, path }) => {
  return <button
    className={styles.button}
    onClick={(event) => store.set(path, (data) => data + value)}>
    {(value > 0 ? '+' : '') + value}
  </button>;
};

const Input = ({path}) => {
  return <input
    $bind={path}
    type="number"
    style={{ border: '2 solid orange', fontSize: '16px', padding: '10px' }}
    value={(data) => data}
    onChange={(event) => {
      store.set(path, parseInt(event.target.value) || 0)
    }}
  />
};

const Counter = ({ path }) => {
  return (
    <div>
      <Button value={-5} path={path}/>
      <Button value={-1} path={path}/>
      <Input path={path}/>
      <Button value={+1} path={path}/>
      <Button value={+5} path={path}/>
      <div $bind={path} className={styles.display}>
        {(data) => data}
      </div>
    </div>
  );
}

omega.render(
  <div className={styles.wrapper}>
    <Counter path={'counter_a.value'}/>
    <Counter path={'counter_b.value'}/>
  </div>,
  store
);