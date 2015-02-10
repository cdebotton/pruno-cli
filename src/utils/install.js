import {spawn} from "child_process";
import colors from "colors";
import {log} from "../logger";
import Promise from "bluebird";

export let save = (packages) => {
  return install('--save', packages, 'install');
};

export let saveDev = (packages) => {
  return install('--save-dev', packages, 'install');
};

export let rmSave = (packages) => {
  return install('--save', packages, 'uninstall');
};

export let rmSaveDev = (packages) => {
  return install('--save-dev', packages, 'uninstall');
};

let install = (method, packages, action = 'install') => {
  packages = Array.isArray(packages) ? packages : [packages];

  let deps = packages.map(pkg => pkg.yellow.underline).join(', ');

  log(
    action === 'install' ? 'Installing' : 'Uninstalling',
    deps,
    'with ',
    method.green
  );

  return new Promise((resolve, reject) => {
    spawn('npm', [action, method].concat(packages), {stdio: false})
      .on('exit', (err, response) => {
        if (err) reject(err);
        log('Installed', deps, 'with ', method.green);
        resolve(response);
      });
  });
};
