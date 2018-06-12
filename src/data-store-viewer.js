import omega from './renderer';

export const createDataStoreViewer = (appendTo, store) => {
  omega.render(
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '200px',
      padding: '5px',
      background: '#444',
      color: '#fff',
      overflow: 'auto'
    }}>
      <pre _bind="" style={{ fontFamily: 'monospace' }}>{data => JSON.stringify(data, null, 2)}</pre>
    </div>,
    appendTo,
    store
  )
};

export default createDataStoreViewer;