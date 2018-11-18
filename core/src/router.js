/**
 * @param options
 * @returns {{}} - Router
 * @constructor
 */
const Router = function (options) {

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

  return {
    getInitialState: options.getInitialState,
    convertURLtoObject,
    init: (store) => {
      document.__omen__isInternalUrl = options.isInternalUrl || (url => url.origin === document.location.origin);
      const routerNode = store.child(options.storePath || '_router');
      document.addEventListener('omen_link', (event) => {
        routerNode.set(convertURLtoObject(new Url(event.target.href)));
      });
    },
  };
};

module.exports = Router;
