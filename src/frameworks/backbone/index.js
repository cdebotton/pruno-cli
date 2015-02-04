import inflection from "inflection";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import {pwd, mkdir} from "shelljs";
import {log} from "../../logger";

class BackboneGenerator {
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

    let hasMethod = Object.getOwnPropertyNames(BackboneGenerator.prototype)
      .indexOf(CREATE_STRING) > -1;

    if (! hasMethod) {
      throw new Error(
        `Invalid generator class type ${classType}, ` +
        `BackboneGenerator has no method ${CREATE_STRING}`
      );
    }

    this[CREATE_STRING](name, options);
  }

  onCreateModel(name, options) {
    var modelName = inflection.transform(
      name, ['classify', 'singularize']
    ) + 'Model';

    var opts = {
      modelName: modelName
    };

    var contents = this.renderData('Model.js.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'models', `${modelName}.js`),
      contents
    );

    log(`Created`, `${this.config.src}/models/${modelName}.js`.yellow.underline);
  }

  onCreateCollection(name, options) {
    var collectionName = inflection.transform(
      name, ['classify', 'pluralize']
    ) + 'Collection';
    var modelName = inflection.transform(
      name, ['classify', 'singularize']
    ) + 'Model';
    var opts = { modelName: modelName, collectionName: collectionName };
    var hasModel = fs.existsSync(
      path.join(pwd(), this.config.src, 'models', `${modelName}.js`)
    );

    if (! hasModel) {
      this.onCreateModel(name, options);
    }

    var contents = this.renderData('Collection.js.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'collections', `${collectionName}.js`),
      contents
    );

    log(`Created`, `${this.config.src}/collections/${collectionName}.js`.yellow.underline);
  }

  onCreateTemplate(name, options) {
    var opts = { templateName: name };
    var contents = this.renderData('Template.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'hbs', `${name}.hbs`),
      contents
    );

    log(`Created`, `${this.config.src}/hbs/${name}.hbs`.yellow.underline);
  }

  onCreateView(name, options) {
    var viewName = inflection.titleize(name).replace(/[\W]/g, '') + 'View';
    var hasTemplate = fs.existsSync(
      path.join(pwd(), this.config.src, 'hbs', `${name}.hbs`)
    );

    if (! hasTemplate) {
      this.onCreateTemplate(name, options);
    }

    var opts = {
      templateName: name,
      viewName: viewName
    };

    var contents = this.renderData('View.js.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'views', `${viewName}.js`),
      contents
    );

    log(`Created`, `${this.config.src}/views/${viewName}.js`.yellow.underline);
  }

  onCreateRouter(name, options) {
    var routerName = inflection.titleize(name).replace(/[\W]/g, '') + 'Router';
    var opts = { routerName: routerName };
    var contents = this.renderData('Router.js.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'routers', `${routerName}.js`),
      contents
    );

    log(`Created`, `${this.config.src}/routers/${routerName}.js`.yellow.underline);
  }

  onCreateHelper(name, options) {
    var helperName = inflection.titleize(name).replace(/[\W]/g, '') + 'Helper';
    var opts = { helperName: helperName };
    var contents = this.renderData('Helper.js.hbs', opts);

    fs.writeFileSync(
      path.join(pwd(), this.config.src, 'helpers', `${helperName}.js`),
      contents
    );

    log(`Created`, `${this.config.src}/helpers/${helperName}.js`.yellow.underline);
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
        case 'model': return 'models';
        case 'collection': return 'collections';
        case 'template': return 'hbs';
        case 'view': return 'views';
        case 'router': return 'routers';
        case 'helper': return 'helpers';
      }
    })();

    var target = path.join(pwd(), this.config.src, pathPart);

    if (! fs.existsSync(target)) {
      mkdir(target);
    }
  }
}

export default new BackboneGenerator();
