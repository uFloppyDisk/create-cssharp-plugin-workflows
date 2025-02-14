#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import prompts from "prompts";
import parameters from "#src/parameters";
import generatePluginFiles from "#src/generatePluginFiles";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(__filename), "../");
const TARGET_BASE = process.env.NODE_ENV === 'production'
  ? process.cwd()
  : path.join(ROOT, '.playground');

const TEMPLATE_BASE = path.join(ROOT, 'templates');

function onCancel() {
  console.log("Cancelled making a CounterStrike Sharp plugin.");
  return false;
}

prompts(parameters, { onCancel })
  .then(answers => {
    console.time("Done in");
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

    const dotnetCommands = [
      'dotnet new solution',
      'dotnet sln add src',
      'dotnet build',
    ]

    if (answers.setupUsingDotnetCli) {
      for (const command of dotnetCommands) {
        console.time(command);
        execSync(command, { cwd: targetPath });
        console.timeEnd(command);
      }
    }

    console.timeEnd("Done in");
  })
  .catch(err => console.error(err.message))
  .finally(() => {
    console.log("Goodbye!");
  });

