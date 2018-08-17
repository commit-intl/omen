import { omega, Store, createStoreViewer } from 'ome';
import styles from './_index.scss';
import App from './App';
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
  <App/>,
  document.body,
  store
);


const storeViewerMiddleware = (data, path) => {
    if (path && path.indexOf('secret') === 0) {
      return '[hidden]';
    }
    return data;
  };

// createStoreViewer(
//   document.body,
//   store,
//   storeViewerMiddleware,
// );