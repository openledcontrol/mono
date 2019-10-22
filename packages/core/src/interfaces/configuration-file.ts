export interface CoreConfigurationFile {
  Plugins: string[];
  LedStrip: LEDStripConfigurationFile;
}

export interface LEDStripConfigurationFile {
  Length: number;
  MaximumBrightness: number;
  Reverse: boolean;
}

export interface ConfigurationFile {
  Core: CoreConfigurationFile;
}




