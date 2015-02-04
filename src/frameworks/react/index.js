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
    }, {
      name: 'isRouteHandler',
      type: 'confirm',
      message: 'Is this component a route handler?',
      default: false
    }], (params) => {
      params.stores || (params.stores = []);
      params.mixins || (params.mixins = []);

      if (params.stores.length > 0) {
        params.mixins.push('StoreListenerMixin');
      }

      if (params.isRouteHandler) {
        params.mixins.push('RouterStateMixin');
        componentName += 'Route';
      }

      var opts = assign({componentName, className}, {
        stores: params.stores,
        mixins: params.mixins.join(', '),
        isRouteHandler: params.isRouteHandler
      });

      var contents = this.renderData('Component.js.hbs', opts);

      if (params.isRouteHandler) {
        this.ensurePath('route');
        var componentType = 'routes';
      }
      else {
        var componentType = 'components';
      }

      var target = path.join(pwd(), this.config.src, componentType, componentName + '.js');

      fs.writeFileSync(target, contents);

      log('Created', target.yellow.underline + '.');
    });
  }

  onCreateStore(name, options) {
    var storeName = inflection.transform(name.replace(/-/g, '_'), ['classify']) + 'Store';
    var actions = fs.readdirSync(path.join(pwd(), this.config.src, 'actions'))
      .filter(file => /\.js$/.exec(file))
      .map(file => file.replace(/\.js$/, ''));

    inquirer.prompt([{
      name: 'actions',
      type: 'checkbox',
      choices: actions,
      message: 'Would you like to bind any actions?'
    }], (params) => {
      params.actions || (params.actions = []);
      var opts = {};
      var actionList = [];

      var actions = params.actions.reduce((memo, actionFile) => {
        var actionData = fs.readFileSync(
          path.join(pwd(), this.config.src, 'actions', actionFile + '.js')
        ).toString().split(/[\r\n]/);

        var searching = false;

        while (actionData.length > 0) {
          var line = actionData.shift();

          if (line.match(/generateActions\(/)) {
            searching = true;
          }

          if (searching && /'(.+)'/.exec(line)) {
            actionList.push(/'(.+)'/.exec(line)[1]);
          }

          if (line.match(/\);/)) {
            searching = false;
          }
        }
      }, []);

      opts.actions = params.actions;
      opts.actionItems = actionList;
      opts.storeName = storeName;

      var contents = this.renderData('Store.js.hbs', opts);
      var target = path.join(
        pwd(), this.config.src, 'stores', storeName + '.js'
      );

      fs.writeFileSync(target, contents);

      log('Created', target.yellow.underline + '.');
    });
  }

  onCreateActions(name, options) {
    var actionsName = inflection.transform(
      name.replace(/-/g, '_'), ['classify']
    ) + 'ActionCreators';

    inquirer.prompt([{
      name: 'actions',
      type: 'input',
      message: 'What actions would you like to generate? (Separate with spaces)'
    }], (params) => {
      var opts = {
        actionsName: actionsName,
        actions: params.actions ? params.actions.split(' ') : false
      };

      var contents = this.renderData('ActionCreator.js.hbs', opts);
      var target = path.join(
        pwd(), this.config.src, 'actions', actionsName + '.js'
      );

      fs.writeFileSync(target, contents);

      log('Created', target.yellow.underline + '.');
    });
  }

  onCreateMixin(name, options) {
    var mixinName = inflection.transform(
      name.replace(/\-/g, '_'),
      ['titleize']
    ).replace(/\s/g, '') + 'Mixin';

    inquirer.prompt([{
      type: 'confirm',
      name: 'takesParams',
      message: 'Does this mixin take parameters?',
      default: false
    }], (params) => {
      var {takesParams} = params;
      var opts = {mixinName, takesParams};
      var contents = this.renderData('Mixin.js.hbs', opts);
      var target = path.join(pwd(), this.config.src, 'mixins', `${mixinName}.js`);

      fs.writeFileSync(target, contents);
      log('Created', target.yellow.underline + '.');
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

Handlebars.registerHelper('actionify', (str) => {
  return 'on' + str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('storeState', (str) => {
  return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/Store$/, '');
});

export default new ReactGenerator();
