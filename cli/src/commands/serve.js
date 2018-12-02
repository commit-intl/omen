const { Command, flags } = require('@oclif/command');
const colors = require('colors');
const WebpackHelper = require('../webpack/webpack.helper');

class ServeCommand extends Command {
  async run() {
    const { flags } = this.parse(ServeCommand);
    const environment = flags.prod ? 'prod' : 'dev';
    const port = flags.port || 3200;
    const host = flags.host || 'localhost';

    this.log(`starting omen dev server`.green);

    const executionDir = process.cwd();
    const server = new WebpackHelper.DevServer(environment, executionDir, {});
    server.listen(port, host, (err) => {
      if (err) {
        throw err;
      }
      this.log(`running at http://${host}:${port}`.green);
    });
  }
}

ServeCommand.description = `start a dev server that renders your app
...
`;

ServeCommand.flags = {
  prod: flags.boolean({ char: 'p', description: 'run in production mode' }),
  port: flags.string({ char: 'P', description: 'start server on port' }),
  host: flags.string({ char: 'H', description: 'start server on host' }),
};

module.exports = ServeCommand;
