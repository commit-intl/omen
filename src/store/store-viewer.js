import omega from '../renderer';
import styles from './store-viewer.scss';

const Param = () => {
  return (
    <div
      _switch={data => typeof data}
      className={(data, path) => path && /^(.*\.)?_[^.]*$/i.test(path) ? styles.paramHidden : styles.param}
    >
      <span className={styles.paramKey}>{(data, path) => path && path.replace(/^.*\./, '')}</span>
      <span _case="number" className={styles.number}>{data => data}</span>
      <span _case="string" className={styles.string}>{data => data}</span>
      <span _case="boolean" className={styles.boolean}>{data => data}</span>
      <ObjectTag _case="object" path={(data, path) => path}/>
    </div>
  );
};

const ObjectTag = ({ path }) => {
  return (
    <div _for={path || ''} className={styles.object}>
      <Param/>
    </div>
  );
};

const OpenCloseButton = ({ store }) => {
  const onClick = (event, data, path) => store.set(path, (data = {}) => ({ ...data, open: !data.open }));
  return (
    <pre className={styles.openCloseButton} onClick={onClick}>
      {data => data && data.open ? '⮞\n⮞\n⮞' : '⮜\n⮜\n⮜'}
    </pre>
  );
};

const StoreViewer = ({ store }) => (
  <div _bind="_store-viewer" className={styles.viewer}>
    <OpenCloseButton store={store}/>
    <div _if={(data) => data && data.open} className={styles.wrapper}>
      <ObjectTag/>
    </div>
  </div>
);

export const createDataStoreViewer = (appendTo, store) => {
  omega.render(
    <StoreViewer store={store}/>,
    appendTo,
    store
  );
};

export default createDataStoreViewer;