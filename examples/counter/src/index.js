import { omen, Store, createStoreViewer } from '@omen/core';
import styles from './index.scss';
import App from './App';
import LocalStorageBinding from '../../../core/src/store/local-storage-binding';

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
    }
  }
};

export const store = new Store(
  initialState,
  new LocalStorageBinding('counter', (path) => path !== 'secret')
);

omen.render(
  <App/>,
  document.body,
  store
);

store.subscribe((value) => console.log('STATE_CHANGE', value));

//
// const storeViewerMiddleware = (data, key) => {
//     if (key === 'secret') {
//       return '[hidden]';
//     }
//     return data;
//   };
//
// createStoreViewer(
//   document.body,
//   store,
//   storeViewerMiddleware
// );