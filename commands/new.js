import {resolve} from "path";
import {pwd} from "shelljs";
import {log} from "../logger";
import {saveDev} from "../utils/install";
import Generator from "../generator";
import scaffolder from "../utils/scaffolder";

let init = (program) => program.command('new [scaffold]')
  .description('Initialize Pruno for this project.')
  .alias('n')
  // .option('-s, --src <src>', 'Where would you like to store the pre-compiled source files?', './src')
  // .option('-d, --dist <dist>', 'Where would you like to store the compiled project files?', './dist')
  // .option('-c, --config <config>', 'Where is the pruno config located?', './config')
  .action((scaffold = false, options = {}) => {

    log('Initializing pruno.');
    // Create .prunorc file
    Generator.rc(options);

    // Create package.json file
    Generator.packageJson(options);

    // Generate gulpfile.js
    Generator.gulpfile(options);

    // Generate config file
    Generator.config(options);

    // Scaffold React project
    scaffolder(scaffold, options);

    saveDev(['pruno', 'gulp']);
  });

export default init;