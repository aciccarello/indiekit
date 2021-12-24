#!/usr/bin/env node
import { createRequire } from "node:module";
import create from "base-create";
import chalk from "chalk";
import prompts from "prompts";
import { questions } from "./lib/questions.js";
import { getPluginPrompts } from "./lib/utils.js";

const require = createRequire(import.meta.url);
const package_ = require("./package.json");

/**
 * @returns {Function} init
 */
export async function init() {
  const { log } = console;

  log(
    `\n${chalk.bold("Welcome to Indiekit!")} ${chalk.white(
      `(${package_.name} v${package_.version})`
    )}`
  );
  log(
    `If you encounter a problem, visit ${chalk.cyan(
      `${package_.bugs.url}`
    )} to search or file a new issue.\n`
  );

  log(`${chalk.green(">")} ${chalk.white("Gathering details…")}`);

  const publication = await prompts(questions);
  const presetPrompts = await getPluginPrompts(publication.presetPlugin);
  const storePrompts = await getPluginPrompts(publication.storePlugin);
  const syndicatorPrompts = await getPluginPrompts(
    publication.syndicatorPlugin
  );

  const preset = await prompts(presetPrompts);
  const store = await prompts(storePrompts);
  const syndicator = await prompts(syndicatorPrompts);

  const dependencies = ["@indiekit/indiekit"];

  const config = {
    publication: {
      me: publication.me,
    },
    plugins: [],
  };

  if (publication.presetPlugin) {
    const { presetPlugin } = publication;

    config.plugins.push(presetPlugin);
    config[presetPlugin] = preset;
    dependencies.push(presetPlugin);
  }

  if (publication.storePlugin) {
    const { storePlugin } = publication;

    config.plugins.push(storePlugin);
    config[storePlugin] = store;
    dependencies.push(storePlugin);
  }

  if (publication.syndicatorPlugin) {
    const { syndicatorPlugin } = publication;

    config.plugins.push(syndicatorPlugin);
    config[syndicatorPlugin] = syndicator;
    dependencies.push(syndicatorPlugin);
  }

  const nodeVersion = 16;

  create({
    dependencies,
    package: {
      description: `Indiekit server for ${publication.me}`,
      keywords: ["indiekit", "indieweb"],
      type: "module",
      engines: {
        node: nodeVersion.toString(),
      },
      author: {
        url: publication.me,
      },
      scripts: {
        start: "indiekit serve",
      },
    },
    files: [
      {
        path: "README.md",
        contents: `# Indiekit server for ${publication.me}\n\nLearn more at <https://getindiekit.com>\n`,
      },
      {
        path: ".nvmrc",
        contents: nodeVersion,
      },
      {
        path: ".indiekitrc.json",
        contents: config,
      },
    ],
    skipGitignore: true,
  });
}
