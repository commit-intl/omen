import { omen, Store } from '@omen/core';
import App from './App';
import './index.scss';

console.log(document.isServer, document.initialState);

export const store = new Store(document.initialState);

omen.render(
  <App/>,
  document.body,
  store,
  { mode: document.isServer ? 'server' : 'client' }
);