"use strict";

let generateStore = (program) => program.command('generate:store <name> [...actions]')
  .description('Generate a flux store, optionally include the names of the ActionCreators you would like to bind.')
  .action((name, actions) => {

  });

export default generateStore;