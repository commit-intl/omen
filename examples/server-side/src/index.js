import {omen, Store} from '@omen/core';
import App from './App';
import './index.scss';
import {getInitialState} from './export';


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

omen.render(
  <App/>,
  document.getElementById('app'),
  store,
  {mode: document.isServer ? 'server' : 'client'}
);