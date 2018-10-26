const { Command, flags } = require('@oclif/command');
const colors = require('colors');
const WebpackHelper = require('../webpack/webpack.helper');

class ServeCommand extends Command {
  async run() {
    const { flags } = this.parse(ServeCommand);
    const environment = flags.prod ? 'prod' : 'dev';
    this.log(`starting omen dev server`.green);

    const executionDir = process.cwd();
    const server = new WebpackHelper.DevServer(environment, executionDir, {});
    server.listen(4000, 'localhost', (err) => {
      if (err) {
        throw err;
      }
      this.log(`dev server running at http://localhost:4000`.green);
    });
  }
}

ServeCommand.description = `start a dev server that renders your app
...
`;

ServeCommand.flags = {
  prod: flags.boolean({ char: 'p', description: 'run in production mode' }),
};

module.exports = ServeCommand;