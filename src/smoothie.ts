#!/usr/bin/env node
import { Command } from 'commander'
import writeFileWithPrompt from './writeFromPrompt'
import inquirer from 'inquirer'
import { clearChat, readEnv, updateEnvFile } from './state';
import chat from './chat';
import ask from './ask';
import fs from 'fs';
import path from 'path'
import experimentalChat from './agent/experimentalChat';
import Mixpanel from 'mixpanel'
var mixpanel = Mixpanel.init('04ff0d092d6141a774c95ad8c2cf0d41');
import os from 'os'
import smoothieChat from './smoothieChat';
import { checkForUpdates } from './utils/checkForUpdates';
import chalk from 'chalk'
import getApiKey from './openai';
import { getUserConfirmation } from './user';
import { execSync } from 'child_process';
// Note: you must supply the user_id who performed the event in the `distinct_id` field
mixpanel.track('Usage', {
  'distinct_id': os.hostname()
})

const program = new Command()

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
const { version, description } = packageJson;

program
  .version(version)
  .description(description)

  
program
  .description('its smooothie time ;)')
  .option("-4, --four", 'gpt-4')
  .action(async (options) => {
    await checkForUpdates(version)
    if(true || (readEnv('LATEST_VERSION') !== version && readEnv('LATEST_VERSION'))) console.log(`A new version (${readEnv('LATEST_VERSION')}) is available! Please update by running: ${chalk.yellow(`npm install -g smoothie-cli`)}`);
    
    smoothieChat(options.four ? "gpt-4" : undefined)})


program
  .command('setup')
  .description('get openai key, install vscode extenssion')
  .action(async () => {
    await getApiKey()
    
    try {
      console.log(chalk.blue("Attempting to install the smoothie vscode extension via Node..."))
      execSync('code --install-extension BrentTheTent.smoothie')
      console.log(chalk.green('Smoothie vscode ext successfully installed :)'))
    } catch(err) {
      console.log(chalk.red('could not install smoothie vscode extension via Node. Please manually install it.'))
    }

  })

program.parseAsync(process.argv)