import inquirer from "inquirer";
import inflection from "inflection";
import assign from "object-assign";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import {pwd, mkdir} from "shelljs";
import {log} from "../../logger";

class ReactGenerator {
  create(classType, name, options) {
    try {
      this.config = require(path.join(pwd(), '.prunorc'));
    }
    catch (err) {
      throw new Error(
        'Pruno has not properly been initialized. Please run ' +
        '`pruno new` in the root of your project.'
      )
    }

    this.ensurePath(classType);

    const CREATE_STRING = `onCreate${classType.charAt(0).toUpperCase()
      + classType.slice(1)}`;

    this.options = (options || {});

    var hasMethod = Object.getOwnPropertyNames(ReactGenerator.prototype)
      .indexOf(CREATE_STRING) > -1;

    if (! hasMethod) {
      throw new Error(
        `Invalid generator class type ${classType}, ` +
        `ReactGenerator has no method ${CREATE_STRING}`
      );
    }

    this[CREATE_STRING](name, options);
  }

  onCreateComponent(name, options) {
    var componentName = inflection.titleize(name).replace(/\W/g, '');
    var className = inflection.transform(componentName, ['underscore', 'dasherize']);
    var stores = fs.readdirSync(path.join(pwd(), this.config.src, 'stores'))
      .filter(file => /\.js$/.exec(file))
      .map(file => file.match(/^(.+)\.js$/)[1]);

    try {
      var mixins = fs.readdirSync(path.join(pwd(), this.config.src, 'mixins'))
        .filter(file => /\.js$/.exec(file))
        .map(file => file.match(/^(.+)\.js$/)[1]);
    }
    catch (err) {
      var mixins = [];
    }

    inquirer.prompt([{
      name: 'stores',
      type: 'checkbox',
      message: 'Would you like to listen to any stores?',
      choices: stores,
      when: () => stores.length > 0
    }, {
      name: 'mixins',
      type: 'checkbox',
      message: 'Would you like to listen to any mixins?',
      choices: mixins,
      when: () => mixins.length > 0
    }], (params) => {
      params.stores || (params.stores = []);
      params.mixins || (params.mixins = []);

      if (params.stores.length > 0) {
        params.mixins.push('StoreListenerMixin');
      }

      var opts = assign({componentName, className}, {
        stores: params.stores,
        mixins: params.mixins.join(', ')
      });

      var contents = this.renderData('Component.js.hbs', opts);

      fs.writeFileSync(
        path.join(pwd(), this.config.src, 'components', componentName + '.js'),
        contents
      );
    });
  }

  renderData(tplFile, opts) {
    var hbsPath = path.join(__dirname, 'generators', tplFile);
    var hbs = fs.readFileSync(hbsPath).toString();
    var template = Handlebars.compile(hbs);
    var contents = template(opts);

    return contents;
  }

  ensurePath(classType) {
    var pathPart = (function () {
      switch(classType) {
        case 'component': return 'components';
        case 'actions': return 'actions';
        case 'mixin': return 'mixins';
        case 'store': return 'stores';
        case 'route': return 'routes';
      }
    })();

    var target = path.join(pwd(), this.config.src, pathPart);

    if (! fs.existsSync(target)) {
      log('Creating directory', target.yellow.underline + '.');
      mkdir(target);
    }
  }
}

Handlebars.registerHelper('camelcase', (str) => {
  return inflection.camelize(str, true);
});

export default new ReactGenerator();
