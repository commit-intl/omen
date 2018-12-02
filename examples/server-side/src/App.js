import {omen} from '@omen/core';
import styles from './App.scss';

const App = (props, state, { headline, link, store }) => {

  store.subscribe((v) => console.log('STATE_CHANGED', v));

  return (
    <div className={styles.host}>
      <h1 className={headline}>{headline}</h1>
      <a href={link}>{link}</a>
    </div>
  );
};

App.data = {
  headline: 'headline',
  link: 'link',
  store: '',
};

export default App;