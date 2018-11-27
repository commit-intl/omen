import {convertURLtoObject} from './helpers';

const Routing = function (options) {
  const getInitialState = (url) => options.getInitialState
    && options.getInitialState(convertURLtoObject(url || document.location));

  return {
    getInitialState,
    init: (store) => {
      const loadInitialState =
        (url) => getInitialState(url)
          .then((state) => store.set((current) => ({...current, ...state})))
          .catch(error => console.error('Failed to load new initial state!', error));

      let currentLocation = convertURLtoObject(document.location);

      const updateLoctaion = (url) => {
        if (options.shouldLoadInitialState(currentLocation, url)) {
          loadInitialState(url)
        }
        routerNode.set(url);
        currentLocation = url;
      };

      if (!document.__omen.initialState) {
        loadInitialState();
      }

      const navigate = (href) => {
        let url = convertURLtoObject(new URL(href));
        updateLoctaion(url);
        window.history.pushState(url, url.href, url.pathname);
      };

      document.__omen.isInternalUrl = options.isInternal;

      const routerNode = store.child(options.storePath);
      routerNode.set(convertURLtoObject(document.location));

      document.__omen.navigate = navigate;


      window.addEventListener('popstate', (event) => {
        if (event && event.state) {
          updateLoctaion(event.state);
        }
      });
    },
  }
};

export default Routing;
