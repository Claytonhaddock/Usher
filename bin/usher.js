#! /usr/bin/env node

// Packages
const shell = require("shelljs");
const path = require("path")

// Paths
const gulp_command = path.join(__dirname, '../node_modules/gulp/bin/gulp.js')
const gulpfile_path = path.join(__dirname, '../gulpfile.js')
const cwd_path = process.cwd();

const cmd = `${gulp_command} --gulpfile ${gulpfile_path} --cwd ${cwd_path} --color always`;

shell.exec("echo Starting Usher...")
shell.exec(cmd);