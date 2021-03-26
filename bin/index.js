#!/usr/bin/env node

const promisify = require('util').promisify;
const path = require('path');
const program = require("commander");
const download = promisify(require('download-git-repo'))
const { exec } = require('child_process');
const execPromise = promisify(exec);
const log = console.log;
const chalk = require('chalk');

const npmInstallPromise = (projectName) => {
    return new Promise((resolve, reject) => {
        const workerProcess = exec('npm install', { cwd: path.resolve(process.cwd(), projectName)}, (error, stdout, stderr) => {
            if (error) {
              resolve([ error ])
              return;
            }
            resolve([ null, [stdout, stderr]])
        });
    })
}

program
    .option('-i, --init <fname>', 'init project')
    .arguments('<projectName>') 
    .action(async (projectName) => {
        await execPromise(`mkdir ${projectName}`)

        log(chalk.green('正在下载源码，请稍后...'));
        await download('direct:https://github.com/zhm19901224/hm-common-template', 
            path.resolve(process.cwd(), projectName),
            { clone: true }
        )

        log(chalk.green('正在安装所需模块...'))
        const [ badError, [stdout, stderr] ] = await npmInstallPromise(projectName)
        if (badError) {
            console.error(chalk.red(badError))
            return
        }
        if (stderr) {
            // 打印出模块安装的warning或者error
            console.error(chalk.red(stderr))
        }
        // 模块安装完成的信息
        console.info(chalk.green(stdout))

        log(chalk.yellow('项目启动中...'))
        exec('npm run dev', { cwd: path.resolve(process.cwd(), projectName)}, (error, stdout, stderr) => {
            if (error) {
              console.error(`执行的错误: ${error}`);
              return;
            }
            console.log(`${stdout}`);
            console.error(`${stderr}`);
        });
    });


program.parse(process.argv);

const options = program.opts();



