const RoutingManager = function (options) {

  const convertURLtoObject = (url) => ({
    href: url.href,
    origin: url.origin,
    hostname: url.hostname,
    protocol: url.protocol,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    query: url.search
    && url.search
      .slice(1)
      .split('&')
      .reduce((acc, val) => {
        let v = val.split('=');
        acc[v[0]] = v[1] || true;
      }, {}),
  });

  const getInitialState = (url) => options.getInitialState
    && options.getInitialState(convertURLtoObject(url || document.location));
  const shouldLoadInitialState = options.shouldLoadInitialState || ((prevUrl, newUrl) => false);

  const self = {
    getInitialState,
    convertURLtoObject,
    shouldLoadInitialState,
    init: (store) => {
      self.loadInitialState =
        (url) => getInitialState(url)
          .then((state) => store.set((current) => ({ ...current, ...state })))
          .catch(error => console.error('Failed to load new initial state!', error));

      let currentLocation = convertURLtoObject(document.location);

      if (!document.__omen__initialState) {
        self.loadInitialState();
      }

      document.__omen__isInternalUrl = options.isInternalUrl || (href => {
        return !/^\w+:\/\//.test(href) || new URL(href).origin === document.location.origin;
      });

      const routerNode = store.child(options.storePath || '_router');
      routerNode.set(convertURLtoObject(document.location));

      const updateLoctaion = (url) => {
        if (shouldLoadInitialState(currentLocation, url)) {
          self.loadInitialState(url)
        }
        routerNode.set(url);
        currentLocation = url;
      };

      document.__omen__navigateTo = options.navigateTo || (
        (href) => {
          let url = convertURLtoObject(new URL(href));
          updateLoctaion(url);
          window.history.pushState(url, url.href, url.pathname);
        }
      );

      window.addEventListener('popstate', (event) => {
        if (event && event.state) {
          updateLoctaion(event.state);
        }
      });
    },
  };
  return self;
};

export default RoutingManager;
