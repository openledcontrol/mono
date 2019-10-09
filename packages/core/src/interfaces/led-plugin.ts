import { LEDStrip } from "../led-strip";
import { ConfigurationFile } from "./configuration-file";

export interface LEDPlugin {
  new (
    ledStrip: LEDStrip,
    pluginRegistry: { [ k: string ]: LEDPlugin },
    configurationFile: ConfigurationFile
  ): LEDPlugin;

  run?(): void;

  shutdown?(): void;
}
