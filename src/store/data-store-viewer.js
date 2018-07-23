import omega from '../renderer';

const KeyTag = ({ key }) => <span style={{ color: '#df92e1' }}>{key}:</span>;

const Param = ({ path, key, value }) => {
  console.log(path);
  return (
    <div _data={typeof value}>
      <KeyTag key={key}/>
      <span _if="object" style={{ color: '#ffff92' }}>{value}</span>
      <span _if="number" style={{ color: '#6292ff' }}>{value}</span>
      <span _if="string" style={{ color: '#62ff92' }}>'{value}'</span>
      <span _if="boolean" style={{ color: '#ffff92' }}>{value}</span>
      <ObjectTag _if="object" path={path} />;
    </div>
  );
};

const ObjectTag = ({ path }) => {
  return (
    <div _for={path} style={{ paddingLeft: '10px' }}>
      <Param path={(data, path) => {console.log(path); return path}} key={(data, path) => path && path.replace(/^.*\./, '')} value={(data) => data} />
    </div>
  );
};

export const createDataStoreViewer = (appendTo, store) => {
  omega.render(
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      maxWidth: '50%',
      padding: '10px 25px 10px 10px',
      background: '#333333',
      color: '#fff',
      overflow: 'auto'
    }}>
      <ObjectTag path={''}/>
    </div>,
    appendTo,
    store
  )
};

export default createDataStoreViewer;