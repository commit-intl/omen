import {omen, Store} from '@omen/core';
import LocalStorageBinding from '@omen/core/local-storage-binding'
import App from './App';
import './index.scss';

const getInitialState = (url) => new Promise((resolve) => setTimeout(() => {
    // fake fetch call, you could here use fetch or any other async method to gather your initial state
    if (url.pathname === '/omen') {
      return resolve({
        'headline': 'Omen is cool!',
        'link': '/',
      });
    }
    else {
      return resolve({
        'headline': 'ServerSideRendering is cool!',
        'link': '/omen',
      });
    }
  },
  50
));

export const store = new Store(document.initialState);

if (!document.initialState) {
  getInitialState(
    document.location.pathname
    + document.location.search
    + document.location.hash
  ).then((state) => {
    store.set(state);
  });
}

omen.renderApp(
  app.render(document.getElementById('app')),
  <App/>,
  new Router(getInitialState, 'options'),
  new LocalStorageBinding('omen-ssr')
);
