import { omega, Store, createStoreViewer } from 'ome';
import styles from './_index.scss';
import { Counter } from './Counter';
import { NewCounter } from './NewCounter';
import {Headline} from './Headline';

export const store =
  new Store({
    'app': {
      'Important': {
        counters: [
          {
            name: 'Tempus Count',
            value: 13,
          },
          {
            name: 'Eternal Size',
            value: -3,
          }
        ],
        newCounter: '',
      },
      'Unnecessary': {
        counters: [
          {
            name: 'Memes Created',
            value: 13,
          },
          {
            name: 'Lifes Changed',
            value: 0,
          }
        ],
        newCounter: '',
      }
    }
  });

store.addListener('', (data) => console.log('STORE_CHANGE', data));

omega.render(
  <div className={styles.wrapper}>
    <Headline>Example Counters</Headline>
    <div _for="app" className={styles.for}>
      <div className={styles.group}>
        <h1 className={styles.groupTitles}>{(data, path) => path && path.replace(/^.*\./, '')}</h1>
        <div _for=".counters">
          <div className={styles.entry}>
            <div className={styles.remove} onClick={(event, data, path) => {
              store.set(path, undefined)
            }}>×
            </div>
            <h2 className={styles.title}>{data => data && data.name}</h2>
            <Counter path=".value"/>
          </div>
        </div>
        <NewCounter/>
      </div>
    </div>
  </div>,
  document.body,
  store
);

createStoreViewer(
  document.body,
  store
);