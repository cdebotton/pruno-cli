import {spawn} from "child_process";
import colors from "colors";
import {log} from "../logger";

export let save = (packages) => {
  return install('--save', packages);
};

export let saveDev = (packages) => {
  return install('--save-dev', packages);
};

let install = (method, packages) => {
  packages = Array.isArray(packages) ? packages : [packages];

  let deps = packages.map(pkg => pkg.yellow.underline.bold).join(', ');

  log('Installing', deps, 'with ', method.green.bold);

  return new Promise((resolve, reject) => {
    spawn('npm', ['install', method].concat(packages), {stdio: false})
      .on('exit', (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
  });
};
