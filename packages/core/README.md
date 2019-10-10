# @openledcontrol/core

Contains the core interfaces, configuration and objects needed for adding plugins. This is required by every plugin.

## Configuration

In your `openledcontrol.toml` file you can set the following options

```
[Core]
# Specify all plugins which should be loaded
# Note that they need to be installed beforehand with npm
Plugins = [
  "@openledcontrol/raspberrypi",
  "@openledcontrol/rest"
]

[Core.LEDStrip]
# Define the length of the LED strip. This is needed to configure
# further services down the line and to set proper sizes for things.
Length = 60
```
