/**
 * Check if given string is a valid URL
 *
 * @param {object} string URL
 * @returns {boolean} String is a URL
 */
export const isUrl = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    new URL(string); // eslint-disable-line no-new
    return true;
  } catch {
    return false;
  }
};

export const getPluginPrompts = async (pluginName) => {
  console.log("pluginName", pluginName);
  const pluginModule = await import(
    pluginName
  ); /* eslint-disable-line node/no-unsupported-features/es-syntax */
  const IndiekitPlugin = pluginModule.default;
  const plugin = new IndiekitPlugin();

  return plugin.info.pluginPrompts;
};
