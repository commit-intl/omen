const { Command, flags } = require('@oclif/command');
const colors = require('colors');
const DevServer = require('../webpack/dev-server');

class ServeCommand extends Command {
  async run() {
    const { flags } = this.parse(ServeCommand);
    const name = flags.name || 'world';
    this.log(`starting omen dev server`.green);
    const server = new DevServer({});
    server.listen(4000, 'localhost', (err) => {
      if (err) {
        throw err;
      }

      this.log(`dev server running at http://localhost:4000`.green);
    });
  }
}

ServeCommand.description = `Describe the command here
...
Extra documentation goes here
`;

ServeCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = ServeCommand;
