import {omen} from '@omen/core';
import styles from './App.scss';

const App = (props, state, { headline, link }) => (
  <div className={styles.host}>
    <h1>{headline}</h1>
    <a href={link}>{link}</a>
  </div>
);

App.data = {
  headline: 'headline',
  link: 'link',
};

export default App;