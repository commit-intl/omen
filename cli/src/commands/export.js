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

      for (let pathString of exportConf.pages) {
        this.log(`exporting '${pathString}'`.green);
        const canonical = pathString.replace(/^\/|\/([#?].*)?$/, '');
        const filePathOut = canonical ? `${canonical}.html` : 'index.html';
        this.log(`  load initial state`);
        const initialState = await exportConf.getInitialState(pathString);
        this.log(`  received initial state (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`);
        const dom = new JSDOM(domRaw, {
          url: 'http://localhost/',
          referrer: 'http://localhost/',
          contentType: 'text/html',
          includeNodeLocations: false,
          runScripts: 'outside-only'
        });

        const stateScript = dom.window.document.createElement('script');
        dom.window.document.head.appendChild(stateScript);
        stateScript.innerHTML = `document.initialState=${JSON.stringify(initialState)};`;
        dom.window.document.initialState = initialState;
        dom.window.document.isServer = true;

        this.log(`  index.html loaded (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`);
        dom.runVMScript(bundleScript);
        fs.writeFileSync(path.join(webpack.config.output.path, filePathOut), dom.serialize());
        dom.window.close();
        this.log(`  rendered '${filePathOut}' (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`);
        timeStarted = Date.now();
      }
      this.log(`SUCCESS (${((-timeStarted + (timeStarted = Date.now()))) / 1000}s)`.green);
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
