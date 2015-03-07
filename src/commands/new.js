import inquirer from "inquirer";
import {existsSync} from "fs";
import {resolve, join} from "path";
import {pwd, echo, exit} from "shelljs";
import {log} from "../logger";
import {saveDev, save} from "../utils/install";
import Generator from "../generator";
import scaffolder from "../utils/scaffolder";

let init = (program) => program.command("new")
  .description("Initialize Pruno for this project.")
  .alias("n")
  .action(() => {
    if (existsSync(join(pwd(), ".prunorc"))) {
      echo("Pruno has already been initialized in this directory.");
      exit(1);
    }
    inquirer.prompt([{
      type: "list",
      name: "type",
      message: "What type of project would you like to create?",
      choices: ["Basic", new inquirer.Separator(), "React", "Backbone"],
      default: "Basic"
    }, {
      type: "input",
      name: "src",
      message: "Where would you like your source assets to be read from?",
      default: "./src"
    }, {
      type: "input",
      name: "dist",
      message: "Where would you like compiled assets to be stored?",
      default: "./dist"
    }, {
      type: "input",
      name: "config",
      message: "Where would you like to store your app config yaml files?",
      default: "./config"
    }, {
      type: "confirm",
      name: "koa",
      message: "Are you building a backend?",
      default: false
    }, {
      type: "input",
      name: "api",
      message: "Where would you like to store your backend files?",
      default: "./api"
    }, {
      type: "confirm",
      name: "db",
      message: "Would you like to use a database?",
      default: false,
      when(answers) {
        return answers.koa;
      }
    }, {
      type: "list",
      name: "dbType",
      message: "What type of database would you like to use?",
      choices: ["Postgres", "MySQL", "MariaDB", "SQLite", "MSSQL"],
      default: "Postgres",
      when(answers) {
        return answers.db;
      }
    }], params => {
      log("Initializing pruno.");
      // Create .prunorc file
      Generator.rc(params);

      // Create package.json file
      Generator.packageJson(params);

      // Generate gulpfile.js
      Generator.gulpfile(params);

      // Generate config file
      Generator.config(params);

      // Generate .eslintrc file
      Generator.eslintrc(params);

      // Scaffold React project
      scaffolder(params.type, params);

      saveDev(["pruno", "gulp"]);

      if (params.koa) {
        Generator.serverRegister(params);
        Generator.server(params);

        save([
          "koa",
          "koa-json",
          "koa-compress",
          "koa-bodyparser",
          "koa-json",
          "koa-static",
          "koa-isomorphic",
          "koa-router",
          "koa-mount",
          "require-dir",
          "react-router",
          "alt"
        ]);
      }

      if (params.db) {
        Generator.sequelizerc(params);
        Generator.dbAssets(params);

        save([
          "sequelize",
          "sequelize-cli",
          "yaml-env-config",
          "object-assign",
          "babel"
        ]);

        switch (params.dbType) {
          case "Postgres":
            save(["pg", "pg-hstore"]);
            break;
          case "MySQL":
            save(["mysql"]);
            break;
          case "MariaDB":
            save(["mariasql"]);
            break;
          case "SQLite":
            save(["sqlite3"]);
            break;
          case "MSSQL":
            save(["tedius"]);
            break;
        }
      }
    });
  });

export default init;
