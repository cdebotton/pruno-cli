import {pwd, cp, mv} from "shelljs";
import {join} from "path";
import {save, saveDev} from "../utils/install";
import buildPath from "../utils/build-path";
import addMixes from "../utils/add-mixes";
import Generator from "../generator";

export default function (scaffold, options) {
  switch(scaffold.toLowerCase()) {
    case 'backbone':
      generateBackbone(options);
      break;
    case 'react':
      generateReact(options);
      break;
    default:
      generateDefaults(options);
      break;
  }
}

var generateReact = (options) => {
  save([
    'react',
    'react-router',
    'fluxd'
    ])
    .then(() => log('Installed front-end assets for React.'))
    .catch(err => log(err));

  addMixes(['js', 'stylus', 'http', 'publish', 'jade'], {
    js: {es6: true},
    stylus: {normalize: true, 'font-awesome': true}
  });

  cp('-Rf', join(__dirname, '..', 'frameworks', 'react', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'frameworks', 'react', 'app', '*'), join(pwd(), options.src));
};

var generateBackbone = (options) => {
  save([
    'backbone',
    'jquery',
    'lodash'
  ])
  .then(() => log('Installed front-end assets for Backbone.'))
  .catch(err => log(err));

  saveDev(['hbsfy', 'handlebars']);

  addMixes(['js', 'stylus', 'http', 'publish', 'jade'], {
    js: {es6: true, handlebars: true},
    stylus: {normalize: true, 'font-awesome': true}
  });

  cp('-Rf', join(__dirname, '..', 'frameworks', 'backbone', 'app', '*'), join(pwd(), options.src));
};

var generateDefaults = (options) => {
  cp('-Rf', join(__dirname, '..', 'frameworks', 'defaults', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'frameworks', 'defaults', 'app', '*'), join(pwd(), options.src));
};
