import { LEDPlugin, LEDStrip, ConfigurationFile } from '@openledcontrol/core';

let ws281x: { configure(options: WS281XConfig): void, render(pixels: Uint32Array): void, reset(): void, width?: number, height?: number, map?: string };
try {
  ws281x = require('rpi-ws281x');
} catch(e) {
  // Module not found as it will only build on raspberry, we mock it for test cases
  ws281x = {
    configure(stripConfiguration: WS281XConfig) {},
    render(pixels: Uint32Array) {},
    reset() {}
  }
}

interface WS281XConfig {
  leds: number;
  dma: number;
  brightness: number;
  gpio: number;
  strip: string;
}

interface RaspberryPiConfiguration {
  ColorOrder?: 'rgb' | 'rbg' | 'brg' | 'bgr' | 'grb' | 'gbr';
  DMA?: number;
  GPIO?: number;
}

interface RaspberryPiConfigurationFile extends ConfigurationFile {
  RaspberryPi?: RaspberryPiConfiguration;
}

export default class RaspberryPiPlugin {

  private ledStrip: LEDStrip;
  private pluginRegistry: { [ k: string ]: LEDPlugin };
  private configurationFile: RaspberryPiConfigurationFile;

  private stripConfiguration: WS281XConfig;

  constructor(
    ledStrip: LEDStrip,
    pluginRegistry: { [ k: string ]: LEDPlugin },
    configurationFile: RaspberryPiConfigurationFile) {
      this.ledStrip = ledStrip;
      this.pluginRegistry = pluginRegistry;
      this.configurationFile = configurationFile;

      if (!configurationFile.RaspberryPi) {
        throw new Error('You need to configure the RaspberryPi plugin. Please check the README.md for instructions.');
      }

      const capabilities = this.ledStrip.getCapabilities();

      this.stripConfiguration = {
        leds: capabilities.ledCount,
        dma: configurationFile.RaspberryPi.DMA || 10,
        brightness: configurationFile.Core.LedStrip.MaximumBrightness,
        gpio: configurationFile.RaspberryPi.GPIO || 18,
        strip: configurationFile.RaspberryPi.ColorOrder || 'grb'
      }

      this.ledStrip.addListener('render', this.render.bind(this));

      ws281x.configure(this.stripConfiguration);
  }

  render() {
    ws281x.render(this.ledStrip.getByteArray());
  }
}
