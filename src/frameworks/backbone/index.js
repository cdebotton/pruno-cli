import inflection from "inflection";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import {pwd} from "shelljs";
import {log} from "../../logger";

class BackboneGenerator {
  create(classType, name, options) {
    const CREATE_STRING = `onCreate${classType.charAt(0).toUpperCase()
      + classType.slice(1)}`;

    this.config = require(path.join(pwd(), '.prunorc'));
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
    var opts = { modelName: modelName };
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

  onCreateView(name, options) {

  }

  onCreateTemplate(name, options) {

  }

  onCreateRouter(name, options) {

  }

  renderData(tplFile, opts) {
    var hbsPath = path.join(__dirname, 'generators', tplFile);
    var hbs = fs.readFileSync(hbsPath).toString();
    var template = Handlebars.compile(hbs);
    var contents = template(opts);

    return contents;
  }
}

export default new BackboneGenerator();
