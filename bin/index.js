#!/usr/bin/env node

const promisify = require('util').promisify;

const path = require('path')
const program = require("commander");
const version = require('../package.json').version
const download = promisify(require('download-git-repo'))
const exec = promisify(require('child_process').exec);


program
    .option('-i, --init <fname>', 'init project')
    .arguments('<projectName>') 
    .action(async (projectName) => {
        await exec(`mkdir ${projectName}`)
        await download('direct:https://github.com/zhm19901224/hm-common-template', path.resolve(process.cwd(), projectName), { clone: true })
        await exec('npm install', { cwd: path.resolve(process.cwd(), projectName)})
        await exec('npm run dev', { cwd: path.resolve(process.cwd(), projectName)})
    });


program.parse(process.argv);

const options = program.opts();



