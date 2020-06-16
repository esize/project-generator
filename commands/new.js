const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const files = require('../lib/files');
const new_inquirer = require('../lib/new_inquirer')

const template_path = path.join(__dirname, '../templates')

const CURR_DIR = process.cwd();

module.exports = async function() {
  clear();

  console.log(
    chalk.yellow(
      figlet.textSync('Project', { horizontalLayout: 'full'})
    )
  );
  

  const run = async () => {
    return new_inquirer.askCreationQuestions();
  };
  run().then((settings) => {
    const projectName = settings.name;
    const template_types = fs.readdirSync(template_path);
    rmMacPresets(template_types);
    let subdirs = [];

    template_types.forEach((element) => {
      if (settings[element] !== 'None') {
        subdirs.push({
          name: settings[element],
          proj_dir: element.toLowerCase(),
          template_dir: `${template_path}/${element}/${settings[element]}`
        });
      }
    });
    if(subdirs.length !== 0) {
      const status = new Spinner("Copying template files...");
      status.start();
      let WORKING_DIR;
      if (fs.readdirSync(CURR_DIR).length > 0){
        WORKING_DIR = `${CURR_DIR}/${projectName}`; 
        fs.mkdirSync(WORKING_DIR);
      } else {
        WORKING_DIR = CURR_DIR;
      }
      console.log(WORKING_DIR);
      subdirs.forEach(el => createSubdirs(el, WORKING_DIR))
      status.stop();
    } else {
      console.error(
        chalk.red(
          "You must select at least 1 project template"
        )
      );
    }

    function createSubdirs(el, WORKING_DIR) {
      if(subdirs.length > 1) {
        fs.mkdirSync(`${WORKING_DIR}/${el.proj_dir}`)
        createDirectoryContents(el.template_dir, `${el.proj_dir}`, WORKING_DIR)
      } else{
        console.log("you found it");
        createDirectoryContents(el.template_dir, '', WORKING_DIR)
      }
    }

    async function createDirectoryContents(template_path, newProjectPath, WORKING_DIR) {
      const filesToCreate = fs.readdirSync(template_path);

      filesToCreate.forEach(async file => {
        const origFilePath = `${template_path}/${file}`;
        const stats = fs.statSync(origFilePath);

        if(stats.isFile()) {
          const contents = fs.readFileSync(origFilePath, 'utf8');

          // NPM is stupid sometimes
          if (file === '.npmignore') file = '.gitignore';
          let writePath;
          if(newProjectPath !== ''){
            writePath = `${WORKING_DIR}/${newProjectPath}/${file}`;
          } else {
            writePath = `${WORKING_DIR}/${file}`;
          }
          fs.writeFileSync(writePath, contents, 'utf8');

        } else if(stats.isDirectory()){
          fs.mkdirSync(`${WORKING_DIR}/${newProjectPath}/${file}`);
          createDirectoryContents(`${template_path}/${file}`, `${newProjectPath}/${file}`, WORKING_DIR)
        }
      })
    }

  });
    
};
