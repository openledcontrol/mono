# @openledcontrol/raspberrypi

Adapter to support LED strips hooked up to a raspberry pi via GPIO pins using the ws281x library.

## Description

Listens to the @openledcontrol/core LEDStrips render event to then update a lightstrip.

## Configuration

In your `openledcontrol.toml` file you can set the following options

```
[RaspberryPi]
# Color order of the LED strip, might be any ordering
ColorOrder = "grb"
# Maximum brightness of the LED strip
MaximumBrightness = 255
# DMA value (defaults to 10)
DMA = 10
# GPIO pin of the raspberry pi being used
GPIO = 18
```
