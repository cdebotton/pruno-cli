import program from 'commander';
import requireDir from 'require-dir';
import colors from "colors";
let {version} = require('../package.json');

program.version(version);

let commands = requireDir('./commands');

Object.keys(commands).forEach(cmd => {
  commands[cmd](program);
});

program.on('--help', () => {
  console.log('  ' + 'Generators:'.yellow.underline.bold);
  console.log('');
  console.log('    ' + 'React:'.yellow.underline.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'react:component'.green.bold + ' ' + '<componentName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'react:actions'.green.bold + ' ' + '<actionsName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'react:store'.green.bold + ' ' + '<storeName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'react:mixin'.green.bold + ' ' + '<mixinName>'.yellow.bold);
  console.log('');
  console.log('    ' + 'Backbone:'.yellow.underline.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:router'.green.bold + ' ' + '<routerName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:view'.green.bold + ' ' + '<viewName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:template'.green.bold + ' ' + '<templateName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:model'.green.bold + ' ' + '<modelName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:collection'.green.bold + ' ' + '<collectionName>'.yellow.bold);
  console.log('      ' + '☁'.cyan + ' pruno g ' + 'backbone:helper'.green.bold + ' ' + '<helperName>'.yellow.bold);


});

program.parse(process.argv);
