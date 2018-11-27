

const isInternal = href => {
  return !/^\w+:\/\//.test(href) || new URL(href).origin === document.location.origin;
};

const shouldLoadInitialState = (newUrl, prevUrl) => false;

const config = {
  routing: {
    storePath: 'location',
    isInternal,
    shouldLoadInitialState,
  }
};

export default config;