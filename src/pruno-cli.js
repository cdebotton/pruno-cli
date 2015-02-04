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
  console.log('      ' + '$'.green + ' pruno g ' + 'react:component'.red + ' ' + '<componentName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'react:actions'.red + ' ' + '<actionsName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'react:store'.red + ' ' + '<storeName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'react:mixin'.red + ' ' + '<mixinName>'.yellow);
  console.log('');
  console.log('    ' + 'Backbone:'.yellow.underline.bold);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:router'.red + ' ' + '<routerName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:view'.red + ' ' + '<viewName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:template'.red + ' ' + '<templateName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:model'.red + ' ' + '<modelName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:collection'.red + ' ' + '<collectionName>'.yellow);
  console.log('      ' + '$'.green + ' pruno g ' + 'backbone:helper'.red + ' ' + '<helperName>'.yellow);


});

program.parse(process.argv);
