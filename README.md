## CLI tool (global)

### Commands
By running `npm install -g pruno`, you will be given access to the pruno terminal command.
Executing `pruno --help` will list the available commands.

```
  Usage: pruno [options] [command]


  Commands:

    add <mix>                                        Install and configure a new pruno-mix.
    generate:actions <name> [...actions]             Generate a set of flux actions.
    generate:component [options] <name> [...mixins]  Generate a React component.
    generate:mixin <name>                            Generate a React mixin.
    generate:store <name> [...actions]               Generate a flux store, optionally include the names of the ActionCreators you would like to bind.
    init [options] [scaffold]                        Initialize Pruno for this project.
    sandbox                                          Start up a sandbox session and interact with your application via the CLI.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Client tools

To initialize a React/Flux project, run `pruno init react`. This will setup the proper folder structure and create your boilerplate files. It will also require the following dependencies:

#### Libraries
- react
- react-router
- fluxd

#### Build
- gulp
- pruno
- pruno-js
- pruno-stylus
- pruno-http
- pruno-publish
- pruno-images

### Server tools

To initialize a koa/sql server, use `pruno init koa`. This will setup a koa backend with routes, models, and a sequelize database scaffold. It will install the following dependencies:

#### Http
- koa
- koa-bodyparser
- koa-compress
- koa-json
- koa-static
- koa-mount
- koa-router
- koa-isomorphic

#### Database
- sequelize
- sequelize-cli
- pg
- pg-hstore
