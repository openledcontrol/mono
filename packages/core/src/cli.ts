import * as toml from 'toml';
import { existsSync, readFileSync } from 'fs';
import { join as pathJoin } from 'path';
import { cwd } from 'process';
import { LEDStrip } from './led-strip';
import { ConfigurationFile, LEDPlugin } from './interfaces';
import * as winston from 'winston';

const CONFIG_FILE_NAME = 'openledcontrol.toml';
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

export function run() {​
  logger.log('info', 'Reading configuration file', { label: 'CORE' });
  const configurationFile = getConfigFile();
  const { LedStrip: ledStripConfig , Plugins: plugins } = configurationFile.Core;

  if (!plugins) {
    logger.log('error', 'No plugins were set. This tool is useless without plugins. Why not install some?', { label: 'CORE' });
    throw new Error('no_plugins_set');
  }

  logger.log('info', `Creating LED Strip instance with ${ledStripConfig.Length} LEDs and ${ledStripConfig.ColorOrder} color order`, { label: 'CORE' });
  const ledStripInstance = new LEDStrip({
    ledCount: ledStripConfig.Length,
    colorOrder: ledStripConfig.ColorOrder,
    dma: ledStripConfig.DMA,
    gpioPin: ledStripConfig.GPIO,
    maximumBrightness: ledStripConfig.MaximumBrightness,
    reverse: ledStripConfig.Reverse
  });

  const pluginRegistry: { [ k: string ]: LEDPlugin } = {};

  logger.log('info', `Instantiating plugins`, { label: 'CORE' });

  // Create all plugins
  plugins.forEach((pluginName) => {
    let DynamicPlugin: LEDPlugin;

    try {
      logger.log('verbose', `Requiring plugin ${pluginName}`, { label: 'CORE' });
      DynamicPlugin = require(pluginName).default;

      logger.log('verbose', `Instantiating plugin ${pluginName}`, { label: 'CORE' });
      pluginRegistry[ pluginName ] =
        new DynamicPlugin(ledStripInstance, pluginRegistry, configurationFile)
    } catch (e) {
      console.log(e);
      logger.log('error', `Plugin ${pluginName} was not found. Did you forget to install it?`, { label: 'CORE' });
      process.exit();
    }
  });

  // Initialisation is complete
  Object.values(pluginRegistry).forEach(plugin => plugin.run && plugin.run());

  // Kill gracefully
  process.on('SIGTERM', function () {
    Object.values(pluginRegistry).forEach(plugin => plugin.shutdown && plugin.shutdown());
  });
}

function getConfigFile(): ConfigurationFile {
  const cwdPath = pathJoin(cwd(), CONFIG_FILE_NAME)

  if (!existsSync(cwdPath)) {
    throw new Error('no_config_file_found');
  }

  const configFile = readFileSync(cwdPath, { encoding: 'utf8' });

  return toml.parse(configFile);
}
