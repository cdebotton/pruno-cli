import {pwd, cp, mv} from "shelljs";
import {join} from "path";
import {save, saveDev} from "../utils/install";
import buildPath from "../utils/build-path";

export default function (scaffold, options) {
  switch(scaffold) {
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

  saveDev([
    'pruno-js',
    'pruno-stylus',
    'pruno-http',
    'pruno-publish',
    'pruno-jade'
    ])
    .then(() => log('Installed build tools for React.'))
    .catch(err => log(err));

  cp('-Rf', join(__dirname, '..', 'statics', 'react', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'statics', 'react', 'app', '*'), join(pwd(), options.src));
}

var generateDefaults = (options) => {
  cp('-Rf', join(__dirname, '..', 'statics', 'defaults', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'statics', 'defaults', 'app', '*'), join(pwd(), options.src));
};
