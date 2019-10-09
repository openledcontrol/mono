import express from 'express';
import { LEDStrip, LEDPlugin, ConfigurationFile } from '@openledcontrol/core';

export default class RestPlugin {
  private app: express.Application;

  private readonly stripLength: number;

  constructor(
    private ledStrip: LEDStrip,
    private pluginRegistry: { [k: string]: LEDPlugin },
    private configurationFile: ConfigurationFile) {
      this.stripLength = this.ledStrip.getCapabilities().ledCount;

      this.app = express();

      this.bindRoutes();
    }

  run() {
    this.app.listen(8081, () => {
      console.log('Server running on port 8081')
    });
  }

  private bindRoutes() {
    this.app.get('/capabilities', this.getCapabilities.bind(this));
    this.app.post('/set-leds', this.postSetLEDS.bind(this));
    this.app.post('/render', this.postRender.bind(this));
  }

  private getCapabilities(req: express.Request, res: express.Response) {
    res.send(this.ledStrip.getCapabilities());
    res.end();
  }

  private postSetLEDS(req: express.Request, res: express.Response) {
    if (!req.body || !(req.body instanceof Array) || req.body.length !== this.stripLength) {
      res.status(400);
      res.send(`Body needs to contain an array of length ${this.stripLength}`);
      res.end();
    }

    res.status(200);
    res.end();
  }

  private postRender(req: express.Request, res: express.Response) {
    this.ledStrip.render();
  }
}
