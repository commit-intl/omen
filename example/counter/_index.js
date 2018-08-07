import { omega, Store, createStoreViewer } from 'ome';
import styles from './_index.scss';
import { Counter } from './Counter';
import { NewCounter } from './NewCounter';
import { Headline } from './Headline';
import { SVG } from './SVG';
import LocalStorageBinding from '../../src/store/local-storage-binding';

const initialState = {
  'secret': 'This will not be shown in the store viewer! Thanks to middleware!',
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
};

export const store = new Store(
  initialState,
  new LocalStorageBinding('counter', (path) => path !== 'secret')
);

omega.render(
  <div className={styles.wrapper}>
    <SVG />
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


const storeViewerMiddleware = (data, path) => {
    if (path && path.indexOf('secret') === 0) {
      return '[hidden]';
    }
    return data;
  };

createStoreViewer(
  document.body,
  store,
  storeViewerMiddleware,
);