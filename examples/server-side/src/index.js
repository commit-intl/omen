import { omen, Store } from '@omen/core';
import App from './App';
import './index.scss';

const isServer = typeof process === 'undefined';

const state = document.initialState;

export const store = new Store(state);

omen.render(
  <App/>,
  document.body,
  store,
  { mode: isServer ? 'client' : 'server' }
);