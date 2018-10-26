const { Command, flags } = require('@oclif/command');
const colors = require('colors');
const WebpackHelper = require('../webpack/webpack.helper');

class BuildCommand extends Command {
  async run() {
    const { flags } = this.parse(BuildCommand);
    const environment = flags.prod ? 'prod' : 'dev';
    this.log(`starting omen dev server`.green);

    const executionDir = process.cwd();
    const webpack = WebpackHelper.createWebpack(environment, executionDir, {});

    webpack.run((err, stats) => {
      if (err) {
        this.log(colors.red(err));
      }
    });
  }
}

BuildCommand.description = `build your app
...
`;

BuildCommand.flags = {
  prod: flags.boolean({ char: 'p', description: 'run in production mode' }),
};

module.exports = BuildCommand;
