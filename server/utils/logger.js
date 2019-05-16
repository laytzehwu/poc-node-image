const chalk = require('chalk');

const Logger = {
    warn: (message) => console.log(chalk.yellow('[WARN] ' + message)),
    error: (message) => console.log(chalk.red('[ERROR] ' + message)),
    info: (message) => console.log(chalk.cyan('[INFO] ' + message)),
    success: (message) => console.log(chalk.green('[SUCCESS] ' + message))
}

module.exports = Logger;