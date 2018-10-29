import {omen} from '@omen/core';
import Attribute from './componentes/Attribute';
import styles from './App.scss';

const App = (props, state, { store }) => (
  <div className={styles.host}>
    <div className={styles.editor}>
      <Attribute key={'document'} value={store} />
    </div>
    <pre className={styles.json}>{store.transform(s => JSON.stringify(s, null, 2))}</pre>
  </div>
);

App.data = {
  store: '',
};

export default App;