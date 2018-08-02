import { omega, Store, createStoreViewer } from 'ome';
import styles from './_index.scss';
import { Counter } from './Counter';
import { NewCounter } from './NewCounter';
import { Headline } from './Headline';
import LocalStorageBinding from '../../src/store/local-storage-binding';

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
      newCounter: '',
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
      newCounter: '',
    }
  }
};

export const store = new Store(
  initialState,
  new LocalStorageBinding('counter', (path) => path !== 'secret')
);

omega.render(
  <div className={styles.wrapper}>
    <svg width="64" height="64" viewBox="0 0 64 64">
      <g>
        <path
          d="M31.97.02A31.98 31.98 0 0 0 1.4 22.67l-.02.05-.19.65-.1.35-.09.36-.15.61-.02.11a31.86 31.86 0 0 0-.68 10.15v.07a31.82 31.82 0 0 0 17.08 25.37h.02A31.95 31.95 0 0 0 31.93 64c14.4 0 26.59-9.54 30.58-22.64l.02-.06.19-.65.1-.35.09-.36.15-.62.02-.1a32 32 0 0 0 .73-9.6v-.02l-.04-.5-.01-.1-.1-.82v-.07a32 32 0 0 0-.24-1.6l-.01-.09a32 32 0 0 0-.15-.76l-.02-.11-.16-.72v-.06a32 32 0 0 0-.18-.71l-.05-.18-.19-.7-.04-.15a32 32 0 0 0-.2-.63l-.03-.12a32 32 0 0 0-.53-1.52l-.08-.23a32 32 0 0 0-.2-.48 31.98 31.98 0 0 0-.7-1.61l-.13-.29-.2-.41-.15-.29a32 32 0 0 0-.27-.53l-.18-.32a32 32 0 0 0-.17-.32l-.14-.24-.42-.7a31.8 31.8 0 0 0-12.16-11.5l-.17-.09-.18-.1A31.95 31.95 0 0 0 31.97.03z"
          fill="#008dfe" fillOpacity=".19"/>
        <path
          d="M59.74 16.02a31.96 31.96 0 0 0-43.67-11.7c13.39.08 15.79 5.32 23.16 16.2C45.75 30.33 63.99 32 63.99 32a32 32 0 0 0-4.25-15.98z"
          fill="#ffb589"/>
        <path
          d="M59.71 47.99a32 32 0 0 0-11.7-43.7c6.63 11.64 3.28 16.35-2.45 28.17-5.23 10.56 2.45 27.2 2.45 27.2a31.98 31.98 0 0 0 11.7-11.67z"
          fill="#f60"/>
        <path
          d="M32.03 63.98A31.98 31.98 0 0 0 63.99 32C57.23 43.55 51.5 43 38.4 43.95c-11.75.75-22.32 15.73-22.32 15.73a31.95 31.95 0 0 0 15.96 4.3z"
          fill="#ffb589"/>
        <path
          d="M4.36 47.96a31.96 31.96 0 0 0 43.66 11.7c-13.38-.07-15.78-5.32-23.15-16.2C18.35 33.65.1 31.98.1 31.98a32 32 0 0 0 4.26 15.98z"
          fill="#f60"/>
        <path
          d="M4.39 16a32 32 0 0 0 11.7 43.68c-6.63-11.64-3.29-16.34 2.45-28.16 5.23-10.56-2.46-27.2-2.46-27.2a31.98 31.98 0 0 0-11.7 11.67z"
          fill="#ffb589"/>
        <path
          d="M32.07 0A31.98 31.98 0 0 0 .1 31.98c6.76-11.56 12.5-11.01 25.6-11.96C37.47 19.28 48.03 4.3 48.03 4.3A31.95 31.95 0 0 0 32.07 0z"
          fill="#f60"/>
        <path
          d="M31.97.02a31.8 31.8 0 0 0-15.9 4.3c13.39.07 15.79 5.32 23.16 16.2 2.05 3.1 5.28 5.38 8.72 7.05 4.12-8.5 5.7-13.38.06-23.27A31.94 31.94 0 0 1 31.97.02zm31.9 29.03z"
          fill="#ffb589"/>
      </g>
      <path
        d="M30.78 2.03a31.56 29.92 0 0 0-17.49 5.04A34.61 32.82 0 0 1 24 5.42 34.61 32.82 0 0 1 58.6 38.23a34.61 32.82 0 0 1-2 10.88 31.56 29.92 0 0 0 5.73-17.16A31.56 29.92 0 0 0 30.78 2.03z"
        fill="#fff" fillOpacity=".73"/>
    </svg>
    <Headline>Example Counters</Headline>
    <div _for="app" className={styles.for}>
      <div className={styles.group}>
        <h1 className={styles.groupTitles}>{(data, path) => path && path.replace(/^.*\./, '')}</h1>
        <div _for=".counters">
          <div className={styles.entry}>
            <div className={styles.remove} onClick={(event, data, path) => {
              store.set(path, undefined)
            }}>×
            </div>
            <h2 className={styles.title}>{data => data && data.name}</h2>
            <Counter path=".value"/>
          </div>
        </div>
        <NewCounter/>
      </div>
    </div>
  </div>,
  document.body,
  store
);


const storeViewerMiddleware = (data, path) => {
    console.log(path);
    if (path && path.indexOf('secret') === 0) {
      return '[hidden]';
    }
    return data;
  };

createStoreViewer(
  document.body,
  store,
  storeViewerMiddleware,
);