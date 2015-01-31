## CLI tool (global)

### Commands
By running `npm install -g pruno`, you will be given access to the pruno terminal command.
Executing `pruno --help` will list the available commands.

```
  Usage: pruno [options] [command]


  Commands:

    init [options] <name> [scaffold]  Initialize Pruno for this project.
    [...commands] [options]           undefined

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
