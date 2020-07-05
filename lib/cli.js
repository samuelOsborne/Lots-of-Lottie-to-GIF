#!/usr/bin/env node
'use strict'

const program = require('commander')

const renderLottie = require('puppeteer-lottie')
const { version } = require('../package')
var fs = require('fs')
var gifDir = ''
var opts = {
  path: program.input,
  output: program.output,
  width: program.width,
  height: program.height,
  quiet: program.quiet,
  style: {
    background: program.background
  },
  gifskiOptions: {
    fps: 50,
    quality: 100
  }
}

function walk (dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (!file.includes('gif')) {
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        if (file.includes('fill' || 'outline') && !file.includes('gif')) {
          gifDir = file.substring(0, file.lastIndexOf('/')) + '/gif'
          try {
            if (!fs.existsSync(gifDir)) {
              fs.mkdirSync(gifDir)
              fs.mkdirSync(gifDir + '/fill')
              fs.mkdirSync(gifDir + '/outline')
              console.log('Creating : ' + gifDir + '/fill')
              console.log('Creating : ' + gifDir + '/outline')
            } else {
              console.log('Directory: ' + gifDir + ' already exists! Skipping...')
            }
          } catch (e) {
            console.log('Directory: ' + gifDir + ' already exists! Skipping...')
          }
        }
        results = results.concat(walk(file))
        // walk(file)
      } else {
        /* Is a file */
        var outputFile = file.substring(file.lastIndexOf('/'), file.length)
        outputFile = outputFile.substring(0, outputFile.indexOf('.'))
        outputFile = outputFile.substring(1, outputFile.length)
        outputFile += '.gif'
        if (outputFile.includes('outline')) {
          outputFile = gifDir + '/outline/' + outputFile
        } else if (outputFile.includes('fill')) {
          outputFile = gifDir + '/fill/' + outputFile
        }
        var newOpts = Object.assign({}, opts)
        newOpts.path = file
        newOpts.output = outputFile
        newOpts.width = program.width
        newOpts.height = program.height
        newOpts.quiet = program.quiet
        newOpts.style.background = program.background
        results.push(newOpts)
      }
    }
  })
  return results
}

module.exports = async (argv) => {
  program
    .name('puppeteer-lottie')
    .version(version)
    .usage('[options]')
    .option('-i, --input <path>', 'relative path to the JSON file containing animation data')
    .option('-w, --width <number>', 'optional output width', (s) => parseInt(s), 500)
    .option('-h, --height <number>', 'optional output height', (s) => parseInt(s), 500)
    .option('-b, --background <css-color-value>', 'optional output background color', '#ffffff')
    .option('-q, --quiet', 'disable output progress', false)

  program.on('--help', () => {
    console.log()
    console.log('Examples:')
    console.log('  $ puppeteer-lottie -i ./animations --width 500')
    console.log('  $ puppeteer-lottie -i ./animations -w 500 -h 500 -b \'#ffffff\' -q true')
  })

  program.parse(argv)

  // From path argument recursivly go over every dir, create a gif folder then for all .jsons in outline and fill
  // Create gif and export to gif folder with the correct filename taken from json file
  let results = walk(program.input)
  for (let i = 0; i < results.length; i++) {
    console.log('\n')
    console.log('----------')
    console.log('Rendering : ')
    console.log(results[i])
    await renderLottie(results[i])
    console.log('Finished rendering')
    console.log('----------')
    console.log('\n')
  }
}
