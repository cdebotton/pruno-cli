## CLI tool (global)
This is a command-line tool for scaffolding projects that use the pruno build tool. This is a very, (very) early release and the general functionality is still worked out. Much of what you see in this README.md includes planned but unfinished commands. What currently works are:

- Initializing empty pruno projects.
- Initializing a react/flux scaffold (no backend).
- Adding pruno mixes via the command line, automatically modifying your ./config/pruno.yaml and your ./gulpfile.js

### Commands
By running `npm install -g pruno`, you will be given access to the pruno terminal command.
Executing `pruno --help` will list the available commands.

```
☁  pruno --help

  Usage: pruno [options] [command]


  Commands:

    generate|g <action> <name>  Generate a new component.
    install|i <mixes...>        Install and configure a new pruno-mix.
    new|n                       Initialize Pruno for this project.
    sandbox                     Start up a sandbox session and interact with your application via the CLI.
    uninstall|rm <mixes...>     Remove pruno mixes.

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
