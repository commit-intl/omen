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
        {
          app.map((value, key) =>
            <Section
              name={key}
              counters={value.child('counters')}
              newCounter={value.child('newCounter')}
            />,
          )
        }
      </div>
    </div>
  );
};

App.data = {
  app: 'app',
};

export default App;


const Section = ({name, counters, newCounter}, data) => {
  console.log(counters, newCounter);
  return (
    <div className={styles.group}>
      <h1 className={styles.groupTitles}>{name}</h1>
      <div>
        {
          counters.map((value) => <Entry self={value}/>,
            value => value && value.name
          )
        }
      </div>
      <NewCounter list={newCounter}/>
    </div>
  );
};


const Entry = ({self}, data) => {
  console.log('Entry', self);
  return (
    <div className={styles.entry}>
      <div className={styles.remove}
           onClick={(event) => self.set(undefined)}
      >×
      </div>
      <h2 className={styles.title}>{self.child('name')}</h2>
      <Counter value={self.child('value')}/>
    </div>
  );
};