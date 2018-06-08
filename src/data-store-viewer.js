import omega from './renderer';

const _o = '_o';

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
      <_o bind="">
        <pre style={{ fontFamily: 'monospace' }}>{data => JSON.stringify(data, null, 2)}</pre>
      </_o>
    </div>,
    appendTo,
    store
  )
};

export default createDataStoreViewer;