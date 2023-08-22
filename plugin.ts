import { initConfig, CONFIG_KEY } from './src/config';
import initServer from './src/server/initServer';
import tasks from './src/tasks';

/**
 * Initializes the plugin:
 * - registers tasks for `toMatchSnapshot` and `toMatchImageSnapshot`.
 * - Make config accessible via `Cypress.env`.
 * @param {Function} on - Method to register tasks
 * @param {Object} globalConfig - Object containing global Cypress config
 */
export const initPlugin = (on: Cypress.PluginEvents, globalConfig: Cypress.PluginConfigOptions) => {
  const config = initConfig(globalConfig.env[CONFIG_KEY]);
  initServer(config);

  // Adding sub objects/keys to `Cypress.env` that don't exist in `cypress.json` doesn't work.
  // That's why the config is stringified and parsed again in `src/utils/commands/getConfig.js#fixConfig`.
  globalConfig.env[CONFIG_KEY] = JSON.stringify(config);

  on('before:browser:launch', (browser: any = {}, launchOptions: any = {}) => {
    const args = Array.isArray(launchOptions) ? launchOptions : launchOptions.args;

    if (browser.name === 'chrome') {
      args.push('--font-render-hinting=medium');
      args.push('--enable-font-antialiasing');
      args.push('--disable-gpu');
    }

    return launchOptions;
  });

  on('task', tasks);
};
