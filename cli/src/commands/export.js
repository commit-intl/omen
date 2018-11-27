const {Command, flags} = require('@oclif/command');
const path = require('path');
const fs = require('fs');
const {Script} = require('vm');
const colors = require('colors');
const WebpackHelper = require('../webpack/webpack.helper');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

class ExportCommand extends Command {
  async run() {
    const {flags} = this.parse(ExportCommand);
    const file = flags.file || 'src/pages.json';
    const environment = flags.prod ? 'prod' : 'dev';

    let timeStarted = Date.now();

    const executionDir = process.cwd();
    const webpack = WebpackHelper.createWebpack(environment, executionDir, {});

    webpack.compiler.run(async (err, stats) => {
      if (err) {
        throw (err);
      }

      this.log(`initial build (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.green);

      const bundleRaw = fs.readFileSync(path.join(webpack.config.output.path, webpack.config.output.filename));
      const bundleScript = new Script(bundleRaw);
      this.log(`bundle.js loaded (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.green);
      const exportConf = require(path.join(executionDir, 'src/export.js'));
      this.log(`export.js loaded (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.green);

      const domRaw = fs.readFileSync(path.join(webpack.config.output.path, 'index.html'));

      let pages = [];

      for (let pathString of exportConf.pages) {
        pages.push(new Promise(resolve => {
          this.log(`exporting '${pathString}'`.green);
          const canonical = pathString.replace(/^\/|\/([#?].*)?$/, '');
          const filePathOut = canonical ? `${canonical}.html` : 'index.html';
          const dom = new JSDOM(domRaw, {
            url: 'http://localhost' + pathString,
            referrer: 'http://localhost/',
            contentType: 'text/html',
            includeNodeLocations: false,
            runScripts: 'outside-only',
          });
          dom.window.document.__omen = {isServer: true};

          this.log(`  index.html loaded (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`);

          dom.window.document.addEventListener('__omen__ready', (event) => {
            fs.writeFileSync(path.join(webpack.config.output.path, filePathOut), dom.serialize());
            dom.window.close();
            this.log(`  rendered '${filePathOut}' (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`);
            resolve(pathString);
          });

          dom.runVMScript(bundleScript);
        }));
      }
      return Promise.all(pages)
        .then(() => {
          this.log(`SUCCESS (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.green);
        })
        .catch((error) => {
          this.log(`FAILURE (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.red, error);
          process.exit(1);
        });
    });
  }
}

ExportCommand.description = `export pre-rendered pages by your ./src/pages.json
...
`;

ExportCommand.flags = {
  file: flags.string({char: 'f', description: 'load pages from another file'}),
  prod: flags.boolean({char: 'p', description: 'run in production mode'}),
};

module.exports = ExportCommand;
