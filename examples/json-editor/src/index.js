import { omen, Store } from '@omen/core';
import App from './App';
import './index.scss';

const initialState = {
  'app': [
    { title: 'Hello', color: null },
    { title: 'World', color: '#333333' },
    { title: 123, color: true },
  ],
  'not app': [
    { title: 'Hello', color: null },
    { title: 'World', color: '#333333' },
    { title: 123, color: true },
  ],
  test:
    { title: 'Hello', color: null },
};

export const store = new Store(initialState);

omen.render(
  document.body,
  <App/>,
  { getInitialState: () => Promise.resolve(initialState) }
);