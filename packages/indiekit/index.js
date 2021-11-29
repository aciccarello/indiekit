import _ from 'lodash';
import {defaultConfig} from './config/defaults.js';
import {mongodbConfig} from './config/mongodb.js';
import {serverConfig} from './config/server.js';
import {Cache} from './lib/cache.js';
import {
  getCategories,
  getPostTemplate,
  getPostTypes,
} from './lib/publication.js';

export const Indiekit = class {
  constructor(config) {
    this._config = config || defaultConfig;
  }

  get application() {
    return this._config.application;
  }

  get publication() {
    return this._config.publication;
  }

  set(key, value) {
    if (typeof key !== 'string') {
      throw new TypeError('Configuration key must be a string');
    }

    if (!value) {
      throw new Error(`No value given for ${key}`);
    }

    _.set(this._config, key, value);
  }

  addEndpoint(endpoint) {
    endpoint = Array.isArray(endpoint) ? endpoint : [endpoint];
    this.application.endpoints = [...this.application.endpoints, ...endpoint];
  }

  addLocale(language, translations) {
    this.application.locales[language] = _.merge(this.application.locales[language], translations);
  }

  addNavigation(item) {
    item = Array.isArray(item) ? item : [item];
    this.application.navigationItems = [...this.application.navigationItems, ...item];
  }

  addRoute(route) {
    route = Array.isArray(route) ? route : [route];
    this.application.routes = [...this.application.routes, ...route];
  }

  addView(view) {
    view = Array.isArray(view) ? view : [view];
    this.application.views = [...this.application.views, ...view];
  }

  async getConfig() {
    const database = await mongodbConfig(this.application.mongodbUrl);

    // Setup databases
    if (database) {
      this.application.hasDatabase = true;
      this.application.cache = database.collection('cache');
      this.publication.posts = database.collection('posts');
      this.publication.media = database.collection('media');
    }

    // Setup cache
    const cache = new Cache(this.application.cache);

    // Update publication configuration
    this.publication.categories = await getCategories(cache, this.publication);
    this.publication.postTemplate = getPostTemplate(this.publication);
    this.publication.postTypes = getPostTypes(this.publication);

    // Application endpoints
    for (const endpoint of this.application.endpoints) {
      endpoint.init(this);
    }

    return this._config;
  }

  async server(options = {}) {
    try {
      const indiekitConfig = await this.getConfig();
      const server = serverConfig(indiekitConfig);
      const {name, version} = indiekitConfig.application;
      const port = options.port || indiekitConfig.server.port;

      return server.listen(port, () => {
        console.log(`Starting ${name} (v${version}) on port ${port}`);
      });
    } catch (error) {
      console.error(error.message);
    }
  }
};
