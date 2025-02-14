#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import prompts from "prompts";
import parameters from "#src/parameters";
import generatePluginFiles from "#src/generatePluginFiles";
import { TARGET_BASE, TEMPLATE_BASE } from "#src/constants";
import { error, renderGoodbye, renderMasthead, warn } from "#src/vanity";

function onCancel() {
  warn("Cancelled making a CounterStrike Sharp plugin.");
  return false;
}

renderMasthead();

prompts(parameters, { onCancel })
  .then(answers => {
    console.time("Done in");
    const targetPath = path.join(TARGET_BASE, answers.containingDirectoryName);

    const pluginName = (() => {
      if (!answers.pluginSameName) {
        return answers.pluginName;
      }

      return answers.containingDirectoryName;
    })();

    if (fs.existsSync(targetPath)) {
      error(`Path ${targetPath} already exists!`);
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
  .catch(err => {
    error(err.message)
  })
  .finally(() => {
    renderGoodbye();
  });

