import {omen, LocalStorageBinding} from '@omen/core';
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

omen.render(
  app.render(document.getElementById('app')),
  <App/>,
  new Router({getInitialState, /* OPTIONS */}),
  new LocalStorageBinding('omen-ssr')
);
