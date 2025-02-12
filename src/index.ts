import path from "path";
import process from "process";
import fs from "fs";

import prompts from "prompts";
import parameters from "#src/parameters";
import generatePluginFiles from "#src/generatePluginFiles";

const TARGET_BASE = process.env.NODE_ENV === 'production'
  ? process.cwd()
  : path.join(process.cwd(), '.playground');

const TEMPLATE_BASE = path.join(process.cwd(), 'templates');

prompts(parameters)
  .then(answers => {
    const pluginName = answers.pluginName;

    const targetPath = (() => {
      if (!answers.containingDirectorySameName) {
        return path.join(TARGET_BASE, answers.containingDirectoryName);
      }

      return path.join(TARGET_BASE, pluginName);
    })();

    if (fs.existsSync(targetPath)) {
      console.error("Path", targetPath, "already exists!");
      return;
    }

    const templatePath = path.join(TEMPLATE_BASE, 'standard-plugin');
    const transforms = {
      "PLUGIN_NAME": pluginName,
      "PLUGIN_AUTHOR": answers.pluginAuthor,
      "PLUGIN_DESCRIPTION": answers.pluginDescription,
      "PLUGIN_VERSION": answers.pluginVersion,
    }

    generatePluginFiles(templatePath, targetPath, transforms);
  })
  .catch(err => console.error(err.message));

