import {save} from "../utils/install";
import {pwd} from "shelljs";

var db = (program) => {
  program.command('db:install <dbType>')
    .description('Install Sequelize and setup database')
    .action(dbType => {

    });

  program.command('db:migration <migrationName>')
    .description('Create a new SQL migration.');

  program.command('db:migrate')
    .description('Run all pending migrations.');

  program.command('db:rollback')
    .description('Roll back migrations');

  return program;
};
export default db;
