import omega from '../renderer';


const Param = ({ path, key, value }) => {

  console.log(path, key, value);
  const KeyTag = () => <span style={{ color: '#df92e1' }}>{key}:</span>;
  let ValueTag;

  switch (typeof value) {
    case 'number':
      ValueTag = <span style={{ color: '#6292ff' }}>{value}</span>;
      break;
    case 'string':
      ValueTag = <span style={{ color: '#62ff92' }}>'{value}'</span>;
      break;
    case 'boolean':
      ValueTag = <span style={{ color: '#ffff92' }}>'{value}'</span>;
      break;
    case 'object':
      ValueTag = <ObjectTag path={path}/>;
      break;
  }

  ValueTag = () => ValueTag;

  return (
    <div _switch={(...args) => typeof value(...args)}>
      <KeyTag/>
      <span _case="number" style={{ color: '#6292ff' }}>{value}</span>
      <span _case="string" style={{ color: '#62ff92' }}>'{value}'</span>
      <span _case="boolean" style={{ color: '#ffff92' }}>'{value}'</span>
      <ObjectTag _case="object" path={path}/>;
    </div>
  );
};

const ObjectTag = ({ path }) => {
  return (
    <div _for={path} style={{ paddingLeft: '10px' }}>
      <Param path={(data, path) => path} key={(data, path) => path && path.replace(/^.*\./, '')} value={(data) => data}/>
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