import { omega } from 'ome';
import { store } from './_index';
import styles from './_index.scss';
import { Counter } from './Counter';
import { NewCounter } from './NewCounter';
import { Headline } from './Headline';
import { SVG } from './SVG';

const App = (props, { app }) => {
  console.log(app);
  let sections = app.map(Section);
  sections.subscribe(result => console.log(result));
  return (
    <div className={styles.wrapper}>
      <SVG/>
      <Headline>Example Counters</Headline>
      <div className={styles.for}>
        {
          sections
        }
      </div>
    </div>
  );
};

App.data = {
  app: 'app',
};

export default App;


const Section = (props, data) => {

  console.log(props, data);

  return (
    <div className={styles.group}>
      <h1 className={styles.groupTitles}>{props.key}</h1>
      <div>
        {
          props.value.map(Entry)
        }
      </div>
      <NewCounter/>
    </div>
  );
};

Section.data = {};


const Entry = (props, data) => (
  <div className={styles.entry}>
    <div className={styles.remove} onClick={(event, data, path) => {
      store.set(path, undefined)
    }}>×
    </div>
    <h2 className={styles.title}>{props.key}</h2>
    <Counter/>
  </div>
);