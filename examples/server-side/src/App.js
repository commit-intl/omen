import {omen} from '@omen/core';
import styles from './App.scss';

const App = (props, state, { headline, link }) => {

  setInterval(() => {
    headline.set((headline) => headline+'!', null, true);
  }, 5000);
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
};

export default App;