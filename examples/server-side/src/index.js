import { omen, Store } from '@omen/core';
import App from './App';
import './index.scss';

export const store = new Store(document.initialState);

omen.render(
  <App/>,
  document.getElementById('app'),
  store,
  { mode: document.isServer ? 'server' : 'client' }
);