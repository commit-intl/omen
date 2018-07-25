import { omega, DataStore, createDataStoreViewer } from 'omega';
import styles from './_index.scss';
import { Counter } from './Counter';
import { NewCounter } from './NewCounter';


export const store =
  new DataStore({
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
  });

store.addListener('', (data) => console.log('STORE_CHANGE', data));

omega.render(
  <div className={styles.wrapper}>
    <div _for={''} className={styles.for}>
      <div className={styles.group}>
        <h1 className={styles.groupTitles}>{(data, path) => path && path.replace(/^.*\./, '')}</h1>
        <div _for={(data, path) => path + '.counters'}>
          <div className={styles.entry}>
            <div className={styles.remove} onClick={(event, data, path) => store.set(path, undefined)}>×</div>
            <h2 className={styles.title}>{data => data && data.name}</h2>
            <Counter path={(data, path) => path + '.value'} />
          </div>
        </div>
        <NewCounter/>
      </div>
    </div>
  </div>,
  document.body,
  store
);

// createDataStoreViewer(
//   document.body,
//   store
// );