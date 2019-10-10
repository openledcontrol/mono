import { LEDStripConfiguration, LEDStripCapabilities } from './interfaces';
import * as chromatism from 'chromatism';
import { EventEmitter } from 'events';

export class LEDStrip extends EventEmitter {

  // Status of all leds
  private readonly ledStatus: number[][];

  // Byte array used to sent off to lightstrips
  private readonly ledByteArray: Uint32Array;

  constructor(private configuration: LEDStripConfiguration) {
    super();

    this.ledStatus = new Array(this.configuration.ledCount);
    this.ledByteArray = new Uint32Array(this.configuration.ledCount);
  }

  /**
   * Sets given led index to given color. Note that this itself will
   * NOT automatically change a color on the led strip. For that to work
   * you need to call render at the end of your changes.
   *
   * @param index Index of the led on the strip
   * @param color New color of the led
   */
  public setLED(index: number, color: string): void {
    if (index >= this.configuration.ledCount) {
      throw new Error('INDEX_OUT_OF_BOUNDS');
    }

    const { r, g, b } = chromatism.convert(color).rgb;
    this.ledStatus[ index ] = [ r, g, b ];
    this.ledByteArray[ index ] = (Math.floor(r) << 16) | (Math.floor(g) << 8)| Math.floor(b);
  }

  /**
   * Returns the status of a single led
   *
   * @param index Index of the led to return
   */
  public getLED(index: number): number[] {
    if (index >= this.configuration.ledCount || index < 0) {
      throw new Error('INDEX_OUT_OF_BOUNDS');
    }

    return this.ledStatus[ index ];
  }

  /**
   * Returns the status of all leds
   */
  public getAllLeds(): number[][] {
    return this.ledStatus;
  }

  /**
   * Returns the byte array as reference.
   *
   * Only mutate this if you know what you're doing.
   */
  public getByteArray(): Uint32Array {
    return this.ledByteArray;
  }

  /**
   * Returns the capabilities of the led strip with maximum brightness and led count
   */
  public getCapabilities(): LEDStripCapabilities {
    return {
      ledCount: this.configuration.ledCount,
      maximumBrightness: this.configuration.maximumBrightness
    }
  }

  /**
   * Resets the strip to all black
   */
  public reset(): void {
    this.ledStatus.forEach((led, index) => {
      this.setLED(index, '#000000');
    });

    this.render();
  }

  /**
   * Emits a render event to which other plugins can subscribe
   * to output pixel values to the light strip.
   */
  public render(): void {
    this.emit('render');
  }
}
