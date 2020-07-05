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
  width: 500,
  height: 500,
  quiet: false,
  style: {
    background: '#ffffff'
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
    .option('-o, --output <path>', 'relative path to store output media (image, image pattern, gif, or mp4)', 'out.png')
    .option('-w, --width <number>', 'optional output width', (s) => parseInt(s))
    .option('-h, --height <number>', 'optional output height', (s) => parseInt(s))
    .option('-b, --background <css-color-value>', 'optional output background color', 'transparent')
    .option('-q, --quiet', 'disable output progress', false)

  program.on('--help', () => {
    console.log()
    console.log('Output must one of the following:')
    console.log('  - An image to capture the first frame only (png or jpg)')
    console.log('  - an image pattern (eg. sprintf format \'frame-%d.png\' or \'frame-%012d.jpg\')')
    console.log('  - an mp4 video file (requires FFmpeg to be installed)')
    console.log('  - a GIF file (requires Gifski to be installed)')
    console.log()
    console.log('Examples:')
    console.log('  $ puppeteer-lottie -i fixtures/bodymovin.json -o out.mp4')
    console.log('  $ puppeteer-lottie -i fixtures/bodymovin.json -o out.gif --width 640')
    console.log('  $ puppeteer-lottie -i fixtures/bodymovin.json -o \'frame-%d.png\' --width 1024 --height 1024')
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
