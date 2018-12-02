

const isInternal = href => {
  return !/^\w+:\/\//.test(href) || new URL(href).origin === document.location.origin;
};

const shouldLoadInitialState = (newUrl, prevUrl, isServer) => isServer;

const config = {
  routing: {
    storePath: 'location',
    isInternal,
    shouldLoadInitialState,
  }
};

export default config;