'use strict';

import {pwd} from "shelljs";
import {spawn} from "child_process";
import assign from "object-assign";

export default (program) => {
  program.command('watch [env]')
    .alias('w')
    .description('Run the tasks registered for watching. Proxies `gulp watch`.')
    .action((env = 'development') => {
      let env = assign({}, process.env, { NODE_ENV: env });
      let watcher = spawn('gulp', ['watch'], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });

  program.command('build [env]')
    .alias('b')
    .description('Run the default registered tasks. Proxies `gulp`.')
    .action((env = 'development') => {
      let env = assign({}, process.env, { NODE_ENV: env });
      let watcher = spawn('gulp', [], {
        stdio: 'inherit',
        env: env,
        cwd: pwd()
      });
    });
};
