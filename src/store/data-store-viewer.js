import omega from '../renderer';

const Param = () => {
  return (
    <div>
      <span style={{ color: '#df92e1', marginRight: '4px' }}>{(data, path) => path && path.replace(/^.*\./, '')}:</span>
      <span _if={data => typeof data === 'number'} style={{ color: '#6292ff' }}>{data => data}</span>
      <span _if={data => typeof data === 'string'} style={{ color: '#62ff92' }}>{data => data}</span>
      <span _if={data => typeof data === 'boolean'} style={{ color: '#ffff92' }}>{data => data}</span>
      <ObjectTag _if={data => typeof data === 'object'} path={(data, path) => path}/>
    </div>
  );
};

const ObjectTag = ({path}) => {
  return (
    <div _for={path || ''} style={{ paddingLeft: '10px', borderLeft: '1px dashed rgba(255,255,255,0.25)'}}>
        <Param/>
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
      <ObjectTag/>
    </div>,
    appendTo,
    store
  )
};

export default createDataStoreViewer;