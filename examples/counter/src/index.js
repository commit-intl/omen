import { omen, Store, createStoreViewer } from '@omen/core';
import styles from './index.scss';
import App from './App';
import LocalStorageBinding from '@omen/core/lib/store/local-storage-binding';

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



omen.render(
  document.body,
  <App/>,
  { getInitialState: () => Promise.resolve(initialState) },
  new LocalStorageBinding('counter', (path) => path !== 'secret')
);