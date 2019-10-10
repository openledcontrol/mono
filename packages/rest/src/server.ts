import express from 'express';
import { json } from 'body-parser';
import { LEDStrip, LEDPlugin, ConfigurationFile } from '@openledcontrol/core';

interface RESTConfigurationFile extends ConfigurationFile {
  REST: {
    Port: number
  }
};

export default class RestPlugin {
  private app: express.Application;

  private readonly stripLength: number;

  constructor(
    private ledStrip: LEDStrip,
    private pluginRegistry: { [k: string]: LEDPlugin },
    private configurationFile: RESTConfigurationFile) {
      this.stripLength = this.ledStrip.getCapabilities().ledCount;

      this.app = express();

      this.app.use(json());

      this.bindRoutes();
    }

  run() {
    this.app.listen(this.listenPort, () => {
      console.log(`REST Server running on port ${this.listenPort}`)
    });
  }

  private get listenPort(): number {
    if (this.configurationFile && this.configurationFile.REST && this.configurationFile.REST.Port) {
      return this.configurationFile.REST.Port;
    }

    // Default port
    return 8080;
  }

  private bindRoutes() {
    this.app.get('/capabilities', this.getCapabilities.bind(this));
    this.app.post('/set-leds', this.postSetLEDs.bind(this));
    this.app.post('/render', this.postRender.bind(this));
    this.app.post('/reset', this.reset.bind(this));
  }

  private getCapabilities(req: express.Request, res: express.Response) {
    res.send(this.ledStrip.getCapabilities());
    res.end();
  }

  private postSetLEDs(req: express.Request, res: express.Response) {
    if (!req.body || !(req.body instanceof Array) || req.body.length !== this.stripLength) {
      res.status(400);
      res.send(`Body needs to contain an array of length ${this.stripLength}`);
      res.end();
    }

    req.body.forEach((color: string | null, index: number) => {
      if (color) {
        this.ledStrip.setLED(index, color);
      }
    })

    res.status(200);
    res.end();
  }

  private reset(req: express.Request, res: express.Response) {
    this.ledStrip.reset();
  }

  private postRender(req: express.Request, res: express.Response) {
    this.ledStrip.render();
  }
}
