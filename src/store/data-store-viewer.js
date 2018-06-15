import omega from '../renderer';

export const createDataStoreViewer = (appendTo, store) => {
  omega.render(
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      maxWidth: '50%',
      padding: '10px 25px 10px 10px',
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