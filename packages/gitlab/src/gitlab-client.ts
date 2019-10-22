import { LEDStrip, ConfigurationFile, LEDPlugin } from '@openledcontrol/core';
import { Gitlab } from 'gitlab';
import { PaginationResponse, PaginatedRequestOptions } from 'gitlab/dist/infrastructure';
import * as chromatism from 'chromatism';

type PipelineStatus = 'running' | 'pending' | 'success' | 'failed' | 'canceled' | 'manual' | 'skipped';

interface GitLabPluginConfig {
  Token?: string;
  Host?: string;
  UpdateInterval?: number;
  Projects?: number[];
  Only?: string;
}

interface GitLabConfigurationFile extends ConfigurationFile {
  GitLab?: GitLabPluginConfig
}

interface Pipeline {
  status: PipelineStatus
}

export default class GitLabClient {
  private animationPeriod = 0;
  private lastTick: number = 0;
  private runTime: number = 0;

  // Config options
  private gitlabAPI: Gitlab;
  private projects: number[];
  private projectStatus: any[] = [];

  private readonly FADE_ANIMATION_TIME: number = 3000;
  private readonly LED_UPDATES_PER_SECOND: number = 30;
  private readonly PROJECT_UPDATE_INTERVAL: number = 15000;
  private readonly SWITCHING_INTERVAL: number = 15000;
  private readonly PIPELINES_PER_PROJECT: number = 0;
  private readonly COLOR_MAP: { [k in PipelineStatus]: string } = {
    running: chromatism.convert('#000055').hex,
    pending: chromatism.convert('#555500').hex,
    success: chromatism.convert('#005500').hex,
    failed: chromatism.convert('#550000').hex,
    canceled: chromatism.convert('#002200').hex,
    manual: chromatism.convert('#005500').hex,
    skipped: chromatism.convert('#111155').hex
  };

  constructor(
    private ledStrip: LEDStrip,
    private pluginRegistry: { [k: string]: LEDPlugin },
    private configuration: GitLabConfigurationFile
  ) {
    // Sanity check for configuration
    if (!this.configuration.GitLab) {
      throw new Error('GitLab plugin needs to be configured in your openledcontrol.toml file. Check README.md for instructions.');
    }

    if (!this.configuration.GitLab.Token) {
      throw new Error('You have not specified a GitLab token in your openledcontrol.toml file. Check README.md for instructions.');
    }

    if (!this.configuration.GitLab.Projects ||
        !(this.configuration.GitLab.Projects instanceof Array) ||
        this.configuration.GitLab.Projects.length === 0) {
      throw new Error('GitLab plugin needs to have at least one entry in Projects in your openledcontrol.toml file. Check README.md for instructions.');
    }
    this.projects = this.configuration.GitLab.Projects;
    this.projectStatus = this.projects.map(() => []);

    if (this.configuration.GitLab.UpdateInterval) {
      this.PROJECT_UPDATE_INTERVAL = this.configuration.GitLab.UpdateInterval;
    }

    // Set Pipelines per project (Caps - Projects - Separator);
    this.PIPELINES_PER_PROJECT = this.configuration.Core.LedStrip.Length - this.projects.length - 1;

    // Set up API client
    this.gitlabAPI = new Gitlab({
      host: this.configuration.GitLab.Host || 'https://gitlab.com',
      token: this.configuration.GitLab.Token
    });

    this.onTick = this.onTick.bind(this);
    this.updateProjects = this.updateProjects.bind(this);
  }

  public run(): void {
    this.lastTick = +new Date();

    // Animate certain LEDs
    setInterval(this.onTick, 1000 / this.LED_UPDATES_PER_SECOND);

    // Schedule updates
    setInterval(this.updateProjects, this.PROJECT_UPDATE_INTERVAL);

    // Do initial run for projects
    this.updateProjects();
  }

  public onTick(): void {
    // Total run time in ms
    const now = +Date.now();
    this.runTime += now - this.lastTick;
    this.lastTick = now;

    // Update current project
    const currentProject = Math.floor(this.runTime / this.SWITCHING_INTERVAL) % this.projects.length;

    // Get faded colors
    const fadeFactor = (this.FADE_ANIMATION_TIME / (this.runTime % this.FADE_ANIMATION_TIME) * 20) - 10;
    const fadeColors = {
      failed: chromatism.brightness(fadeFactor, this.COLOR_MAP.failed).hex,
      running: chromatism.brightness(fadeFactor, this.COLOR_MAP.running).hex
    }

    // Animate last failed and running states
    const pipelineColors = this.projectStatus[ currentProject ].map((pipeline: Pipeline, index: number) => {
      // Special treatment for failed first index and running
      if (pipeline.status === 'failed' && index === 0) {
        return fadeColors.failed;
      } else if (pipeline.status === 'running') {
        return fadeColors.running;
      }

      // Otherwise just return colors
      return this.COLOR_MAP[ pipeline.status ];
    });

    const projectColors = this.projects.map((project: any, index: number) => index === currentProject ? '#666666' : '#222222');

    // Update LEDs and render
    [
      ...projectColors,
      '#000000',
      ...pipelineColors
    ].forEach((color: string, index: number) => this.ledStrip.setLED(index, color));
    this.ledStrip.render();
  }

  /**
   * Update projects from gitlab
   */
  public updateProjects(): void {
    const queryObject: PaginatedRequestOptions = {
      perPage: this.PIPELINES_PER_PROJECT,
      page: 0,
      maxPages: 1,
      showPagination: true
    }

    if (this.configuration.GitLab && this.configuration.GitLab.Only) {
      queryObject.ref = this.configuration.GitLab.Only;
    }

    this.projects.forEach((projectId: number, index: number) => {
      this.gitlabAPI.Pipelines.all(projectId, queryObject)
        .then((response) => {
          this.projectStatus[ index ] = (<PaginationResponse>response).data;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
