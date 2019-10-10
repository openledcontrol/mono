# @openledcontrol/rest

Expose a REST api to control your LED strip.

## Installation

#### Using npm

```npm install @openledcontrol/rest```

#### Using yarn

```yarn add @openledcontrol/rest```

## Description

This will host an express server which exposes a few endpoints to control LED strips:

#### GET /capabilities

Returns the capabilities of the LED strip in the following form:

```
// Response
{
  "ledCount": <number>,
  "maximumBrightness": <number>
}
```

#### POST /set-leds

Expects an array of either css hex, hsl or rgb values exactly matching the ledCount from the capabilities call.

If you don't want to set certain LEDs, you can replace the values with null instead.

Responds with 200 OK in case the LEDs were set successfully.

**Note:** This does **not** immediately update any attached LED strip.

```
// Request
[
  "#ffffff",
  "rgb(255,255,255)",
  null,
  "#001122"
]
```

#### POST /render

Triggers an update of the light strip. In case of success will return 200 OK.

This request has neither a request nor response payload.

#### POST /reset

Resets the LEDs on the strip.

This request has neither a request nor response payload.

## Configuration

In your `openledcontrol.toml` file you can set the following options

```
[REST]
# Port number the rest server will listen on. Make sure it's not in use by something else.
Port = 8081
```
