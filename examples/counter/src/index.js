import { omen } from '@omen/core';
import styles from './index.scss';
import App from './App';

let saved = window.localStorage.getItem('omen_counter');
const initialState = saved ? {app: JSON.parse(saved)} : {
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
  document.getElementById('app'),
  <App/>,
  {
    getInitialState: () => Promise.resolve(initialState),
    shouldLoadInitialState: (newUrl, prevUrl, isServer) => (prevUrl == null || isServer)
  },
);