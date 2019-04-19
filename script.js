const fs = require('fs-extra');
var path = require('path')
const root = "../Takeout/Google_Photos";
const colors = require('colors');
start();

async function start() {
  fs.readdir(root)
    .then(elements => {
      const directories = elements.filter(e => isDirectory(e));
      directories.forEach(async directory => {
        if (await dirIsEmpty(directory)) {
          console.log(colors.blue(`${directory} is Empty !`));
          removeDirectory(directory);
        } else {
          if (await dirContainsJson(directory)) {
            // console.log(colors.blue.underline(directory), 'contains .json files');
            removeJsonInDir(directory);
          } else {
            console.log(colors.green.underline(directory), 'doesn\'t contains .json files');
          }
        }
      })
    })
    .catch(e => {
      console.log(colors.red(e));
    });
}

function isDirectory(element) {
  return fs.lstatSync(`${root}/${element}`).isDirectory();
}

async function dirIsEmpty(file) {
  return await fs.readdir(`${root}/${file}`)
    .then(files => {
      return !files.length
    }).catch(e => console.log(colors.red(e)))
}

function removeDirectory(dir) {
  fs.remove(`${root}/${dir}`)
    .then(e => {
      console.log(colors.green(dir, 'removed'));
    })
    .catch(e => console.log(colors.red(dir, e)))
}

async function dirContainsJson(dir) {
  return fs.readdir(`${root}/${dir}`)
    .then(files => {
      return files.some(file => path.extname(file) === '.json');
    })
}

async function removeJsonInDir(dir) {
  const dirFiles = await fs.readdir(`${root}/${dir}`)
  const jsonFiles = dirFiles.filter(file => path.extname(file) === '.json');
  jsonFiles.forEach(jsonFile => {
    fs.remove(`${root}/${dir}/${jsonFile}`)
      .then(() => {
        console.log(colors.green(`${dir}/${jsonFile} removed`));
      })
      .catch(e => {
        console.log(colors.red(`Error removing file ${dir}/${jsonFile} e`));
      })
  })
  // fs.remove(`${root}/${dir}`)
}