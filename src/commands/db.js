import assign from "object-assign";
import path from "path";
import {save} from "../utils/install";
import {pwd} from "shelljs";
import {spawn} from "child_process";

var db = (program) => {
  var env = assign({}, process.env, {
    PATH: path.join(pwd(), 'node_modules/.bin') + ':' + process.env.PATH
  });

  program.command('db:install <dbType>')
    .description('Install Sequelize and setup database')
    .action(dbType => {
      spawn('sequelize', ['init'], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });

  program.command('db:migration <migrationName>')
    .description('Create a new SQL migration.')
    .action(migrationName => {
      var migration = spawn('sequelize', ['migration:create', `--name=${migrationName}`], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });

  program.command('db:migrate')
    .description('Run all pending migrations.')
    .action(() => {
      var migration = spawn('sequelize', ['db:migrate'], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });

  program.command('db:rollback')
    .description('Roll back migrations')
    .action(() => {
      var migration = spawn('sequelize', ['db:migrate:undo'], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });

  return program;
};
export default db;
