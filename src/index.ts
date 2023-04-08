#!/usr/bin/env node
import { Command } from 'commander'
import getApiKey from './getApiKey'
import writeFileWithPrompt from './writeToFileWithPrompt'
import inquirer from 'inquirer'
import {print} from './state';
import chat, { getUserInput } from './chat';
const program = new Command()


program.version('0.0.1').description('My CLI tool')

// Checks for OpenAI key and prompts user if it's not in the .env
program.action(async () => {
  await getApiKey()
})

program
  .command('chat')
  .action(chat)

// openai call says unauthorized 401


program
  .command('write')
  .requiredOption('-f, --file-path <filepath>', 'file path')
  .requiredOption('-p, --prompt <prompt>', 'prompt')
  .action(async ({ filePath, prompt }) => {
    
    // Do something with the file path and prompt
    const res = await writeFileWithPrompt(filePath, prompt, false);
    print(res);
  });

program
  .command('create')
  .requiredOption('-f, --file-path <filepath>', 'file path')
  .requiredOption('-p, --prompt <prompt>', 'prompt')
  .action(async ({ filePath, prompt }) => {
    
    // Do something with the file path and prompt
    const res = await writeFileWithPrompt(filePath, prompt, true);
    print(res);
  });

program.parse(process.argv)
