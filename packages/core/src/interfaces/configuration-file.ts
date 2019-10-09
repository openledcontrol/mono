export interface CoreConfigurationFile {
  Plugins: string[];
  LedStrip: LEDStripConfigurationFile;
}

export interface LEDStripConfigurationFile {
  Length: number;
  ColorOrder: 'rgb' | 'rbg' | 'brg' | 'bgr' | 'grb' | 'gbr';
  MaximumBrightness: number;
  DMA: number;
  GPIO: number;
}

export interface ConfigurationFile {
  Core: CoreConfigurationFile;
}




