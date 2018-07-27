import omega from '../renderer';

const Param = ({ path, key, value }) => {
  return (
    <div _data={(data) => {console.log(data, typeof value(data)); return typeof value(data)}}>
      <span style={{ color: '#df92e1' }}>{key}:</span>
      <span _if="number" style={{ color: '#6292ff' }}>{value}</span>
      <span _if="string" style={{ color: '#62ff92' }}>'{value}'</span>
      <span _if="boolean" style={{ color: '#ffff92' }}>{value}</span>
      <ObjectTag _if="object" path={path} />
    </div>
  );
};

const ObjectTag = ({ path }) => {
  return (
    <div _for={path} style={{ paddingLeft: '10px' }}>
      {(data, path) => {console.log(data,path); return JSON.stringify(data)}}
      <Param path={(data, path) => {console.log(path);return path}} key={(data, path) => path && path.replace(/^.*\./, '')} value={(data) => data} />
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