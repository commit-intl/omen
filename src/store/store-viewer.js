import omega from '../renderer';

const styles = {};

styles.viewer = {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  maxWidth: '50%',
  paddingLeft: '16px',
  fontFamily: 'monospace',
  boxShadow: '0 0 8px rgba(0,0,0,0.5)',
  background: 'rgb(51, 51, 51)',
  color: 'rgb(255, 255, 255)',
  overflowY: 'auto',
};

styles.wrapper = {
  position: 'relative',
  padding: '10px 25px 10px 10px',
};

styles.openCloseButton = {
  position: 'absolute',
  left: '0',
  top: '50%',
  lineHeight: '22px',
  fontSize: '16px',
  padding: '2px',
  width: '12px',
  transform: 'translateY(-50%)',
  color: 'rgb(0, 0, 0)',
  background: 'rgb(204, 204, 204)',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
};

styles.param = {};

styles.paramHidden = {
  opacity: '.5',
};

styles.paramKey = {
  color: '#df92e1',
  marginRight: '4px',
};

styles.number = {
  color: '#6292ff',
};

styles.string = {
  color: '#62ff92',
};

styles.boolean = {
  color: '#ffff92',
};

styles.object = {
  paddingLeft: '10px',
  borderLeft: '1px dashed rgba(255, 255, 255, 0.25)',
};


const Param = ({middleware}) => {
  const value = middleware
    ? ((data, path) => middleware(data, path))
    : (data => data);
  return (
    <div
      _switch={data => typeof data}
      style={(data, path) => path && /^(.*\.)?_[^.]*$/i.test(path) ? styles.paramHidden : styles.param}
    >
      <span style={styles.paramKey}>{(data, path) => path && path.replace(/^.*\./, '')}</span>
      <span _case="number" style={styles.number}>{value}</span>
      <span _case="string" style={styles.string}>{value}</span>
      <span _case="boolean" style={styles.boolean}>{value}</span>
      <ObjectTag _case="object" path={(data, path) => path} middleware={middleware}/>
    </div>
  );
};

const ObjectTag = ({path, middleware}) => {
  return (
    <div _for={path || ''} style={styles.object}>
      <Param middleware={middleware}/>
    </div>
  );
};

const OpenCloseButton = ({store}) => {
  const onClick = (event, data, path) => store.set(path, (data = {}) => ({...data, open: !data.open}));
  return (
    <pre style={styles.openCloseButton} onClick={onClick}>
      {data => data && data.open ? '>\n>\n>' : '<\n<\n<'}
    </pre>
  );
};

const StoreViewer = ({store, middleware}) => (
  <div _bind="_store-viewer" style={styles.viewer}>
    <OpenCloseButton store={store}/>
    <div _if={(data) => data && data.open} style={styles.wrapper}>
      <ObjectTag middleware={middleware}/>
    </div>
  </div>
);

export const createStoreViewer = (appendTo, store, middleware) => {
  omega.render(
    <StoreViewer store={store} middleware={middleware}/>,
    appendTo,
    store
  );
};

export default createStoreViewer;