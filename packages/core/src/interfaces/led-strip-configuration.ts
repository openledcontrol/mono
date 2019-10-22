export interface LEDStripConfiguration {
  // Number of addressable LEDs on the strip
  ledCount: number;

  // Maximum brightness, defaults to 255
  maximumBrightness: number;

  // DMA value, defaults to 10
  dma?: number;

  // GPIO pin number, defaults to 18
  gpioPin?: number;

  // The RGB sequence may vary on some strips. Valid values
  // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
  // Default is "rgb".
  // RGBW strips are not currently supported.
  // Defaults to 'grb'
  colorOrder?: string;

  // Defaults to false
  reverse?: boolean;
}
