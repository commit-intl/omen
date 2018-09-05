import {omega} from 'ome';
import {store} from './_index';
import styles from './_index.scss';
import {Counter} from './Counter';
import {NewCounter} from './NewCounter';
import {Headline} from './Headline';
import {SVG} from './SVG';

const App = (props, {app}) => {
  return (
    <div className={styles.wrapper}>
      <SVG/>
      <Headline>Example Counters</Headline>
      <div className={styles.for}>
        {app.map(Section)}
      </div>
    </div>
  );
};

App.data = {
  app: 'app',
};

export default App;


const Section = ({_value, _key}, data) => {
  return (
    <div className={styles.group}>
      <h1 className={styles.groupTitles}>{_key}</h1>
      <div>
        {
          _value.child('counters').map(Entry, value => value && value.name)
        }
      </div>
      <NewCounter list={_value}/>
    </div>
  );
};


const Entry = ({_value, _key}, data) => {
  return (
    <div className={styles.entry}>
      <div className={styles.remove}
           onClick={(event) => _value.set(undefined)}
      >×
      </div>
      <h2 className={styles.title}>{_value.child('name')}</h2>
      <Counter value={_value.child('value')}/>
    </div>
  );
};