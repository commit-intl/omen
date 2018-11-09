/*
 * !!! IMPORTANT !!!
 * The render process is not started, until this function is resolved
 */
module.exports = {
  pages: [
    '/',
    '/omen',
  ],
  getInitialState:
    (path) => new Promise((resolve) => setTimeout(() => {
        // fake fetch call, you could here use fetch or any other async method to gather your initial state
        if (path === '/omen') {
          return resolve({
            'headline': 'Omen is cool!',
            'link': '/',
          });
        }
        else {
          return resolve({
            'headline': 'ServerSideRendering is cool!',
            'link': '/omen',
          });
        }
      },
      2000
    )),
};
