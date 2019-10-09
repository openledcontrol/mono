import { LEDStripConfiguration, LEDStripCapabilities } from './interfaces';
import * as chromatism from 'chromatism';
import { EventEmitter } from 'events';

export class LEDStrip extends EventEmitter {

  // Status of all leds in
  private ledStatus: number[][];
  private ledByteArray: Uint32Array;

  constructor(private configuration: LEDStripConfiguration) {
    super();

    this.ledStatus = new Array(this.configuration.ledCount);
    this.ledByteArray = new Uint32Array(this.configuration.ledCount);
  }

  public setLED(index: number, color: string): void {
    if (index >= this.configuration.ledCount) {
      throw new Error('INDEX_OUT_OF_BOUNDS');
    }

    const { r, g, b } = chromatism.convert(color).rgb;
    this.ledStatus[ index ] = [ r, g, b ];
    this.ledByteArray[ index ] = (Math.floor(r) << 16) | (Math.floor(g) << 8)| Math.floor(b);
  }

  public getLED(index: number): number[] {
    if (index >= this.configuration.ledCount) {
      throw new Error('INDEX_OUT_OF_BOUNDS');
    }

    return this.ledStatus[ index ];
  }

  public getStatus(): number[][] {
    return this.ledStatus;
  }

  public getByteArray(): Uint32Array {
    return this.ledByteArray;
  }

  public getCapabilities(): LEDStripCapabilities {
    return {
      ledCount: this.configuration.ledCount,
      maximumBrightness: this.configuration.maximumBrightness
    }
  }

  public render(): void {
    this.emit('render');
  }
}
