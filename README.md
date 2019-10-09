# @openledcontrol

Monorepo to host the open source utilities to manage LED strips through plugins.

## Documentation

### Installation & Configuration

#### Local (Preferred)

As a best practice and to not pollute the global namespace it is suggested you
create a directory to install everything as you also need to create a configuration

#### Global

You can also choose to install the package globally, although that means you have to install the plugins globally as well.

**npm**

```npm i -g @openledcontrol/core```

**yarn**

```yarn i -g @openledcontrol/core```

## Available Packages and Plugins

| Package                     | Description                                                       |
|-----------------------------|-------------------------------------------------------------------|
| @openledcontrol/cli         | Command line utility                                              |
| @openledcontrol/core        | Common interfaces needed for all packages                         |
| @openledcontrol/raspberrypi | Bindings to sync led strip state through Raspi GPIO pins          |
| @openledcontrol/web-ui      | Web interface for retrieving and updating led strip state         |
| @openledcontrol/socket      | Adds a TCP socket protocol to update and retrieve led strip state |
| @openledcontrol/ws          | Adds websocket support to update and retrieve led strip state     |

## Contribution

tbd
