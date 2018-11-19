
const RoutingManager = function (options) {

  const convertURLtoObject = (url) => ({
    ...url,
    query: url.search
      .slice(1)
      .split('&')
      .reduce((acc, val) => {
        let v = val.split('=');
        acc[v[0]] = v[1] || true;
      }, {}),
  });

  const getInitialState =
    (url) => options.getInitialState && options.getInitialState(convertURLtoObject(url || document.location));

  return {
    getInitialState,
    convertURLtoObject,
    init: (store) => {
      document.__omen__isInternalUrl = options.isInternalUrl || (url => url.origin === document.location.origin);
      const routerNode = store.child(options.storePath || '_router');
      document.addEventListener('__omen__link', (event) => {
        let url = convertURLtoObject(new Url(event.target.href));
        if (typeof options.shouldLoadInitialState === 'function' && options.shouldLoadInitialState(document.location, url)) {
          options.getInitialState(url);
        }
        routerNode.set(url);
      });
    },
  };
};

export default RoutingManager;
