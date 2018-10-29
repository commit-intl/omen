import {omen, Store} from '@omen/core';
import App from './App';
import './index.scss';

const initialState = {
  'app': [
    {title: 'Hello', color: null},
    {title: 'World', color: '#333333'},
    {title: 123, color: true},
  ],
};

export const store = new Store(initialState);

omen.render(
  <App />,
  document.body,
  store,
);