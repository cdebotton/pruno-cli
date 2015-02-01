import {pwd, cp, mv} from "shelljs";
import {join} from "path";
import {save, saveDev} from "../utils/install";
import buildPath from "../utils/build-path";
import addMixes from "../utils/add-mixes";
import Generator from "../generator";

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

  addMixes(['js', 'stylus', 'http', 'publish', 'jade'], {
    js: {es6: true},
    stylus: {normalize: true, 'font-awesome': true}
  });

  cp('-Rf', join(__dirname, '..', 'statics', 'react', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'statics', 'react', 'app', '*'), join(pwd(), options.src));
}

var generateDefaults = (options) => {
  cp('-Rf', join(__dirname, '..', 'statics', 'defaults', 'config', '*'), join(pwd(), options.config));
  cp('-Rf', join(__dirname, '..', 'statics', 'defaults', 'app', '*'), join(pwd(), options.src));
};
