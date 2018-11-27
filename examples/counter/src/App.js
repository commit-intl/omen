import {omen} from '@omen/core';
import {store} from './index';
import styles from './index.scss';
import {Counter} from './components/Counter';
import {NewCounter} from './components/NewCounter';
import {Headline} from './components/Headline';
import {SVG} from './components/SVG';

const App = (props, state, {app}) => {
  app.subscribe((appState) => {
    window.localStorage.setItem('omen_counter', JSON.stringify(appState))
  });

  return (
    <div className={styles.wrapper}>
      <SVG/>
      <Headline>Omen Example: Counter</Headline>
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
  secret: 'secret',
};

export default App;


const Section = ({name, counters, newCounter}) => {
  return (
    <div className={styles.group}>
      <h1 className={styles.groupTitles}>{name}</h1>
      <div>
        {
          counters.map((value) => <Entry self={value}/>)
        }
      </div>
      <NewCounter
        target={counters}
        value={newCounter}
      />
    </div>
  );
};


const Entry = ({self}) => {
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