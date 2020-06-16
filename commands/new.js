const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

const files = require('../lib/files');
const new_inquirer = require('../lib/new_inquirer')

const template_path = path.join(__dirname, '../templates')

const CURR_DIR = process.cwd();

module.exports = async function() {
  let err = [];

  clear();

  console.log(
    chalk.yellow(
      figlet.textSync('Project', { horizontalLayout: 'full'})
    )
  )
  
  let settings;

  const run = async () => {
    settings = new_inquirer.askCreationQuestions();
  };
  run().then(() => {
    const projectName = settings.name;
    const template_types = fs.readdirSync(template_path);
    rmMacPresets(template_types);
    let subdirs = [];
    
    template_types.forEach(element => {
      if(settings[element] !== "None"){
        subdirs.push({
          name: settings[element],
          proj_dir: element.toLowerCase(),
          template_dir: `${template_path}/${element}/${settings[element]}`
        })
      }
    })
    let newProjDir = CURR_DIR;
    if(subdirs.length !== 0) {
      fs.mkdirSync(`${CURR_DIR}/${projectName}`)
    } else {
      err.push("You must select at least 1 project template")
    }

    subdirs.forEach(el => createSubdirs(el))
      

    function createSubdirs(el) {
      if(subdirs.length > 1) {
        fs.mkdirSync(`${CURR_DIR}/${projectName}/${el.proj_dir}`)
        
        
        createDirectoryContents(el.template_dir, `${projectName}/${el.proj_dir}`)
      } else{
        createDirectoryContents(el.template_dir, projectName)
      }
    }

    async function createDirectoryContents(template_path, newProjectPath) {
      const filesToCreate = fs.readdirSync(template_path);

      filesToCreate.forEach(async file => {
        const origFilePath = `${template_path}/${file}`;
        const stats = fs.statSync(origFilePath);

        if(stats.isFile()) {
          const contents = fs.readFileSync(origFilePath, 'utf8');

          // NPM is stupid sometimes
          if (file === '.npmignore') file = '.gitignore';

          const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
          fs.writeFileSync(writePath, contents, 'utf8');

        } else if(stats.isDirectory()){
          fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

          createDirectoryContents(`${template_path}/${file}`, `${newProjectPath}/${file}`)
        }
      })
    }
    if(err.length > 0){
      err.forEach(error => {
        console.log(
          chalk.red(error)
        )
      })
    } else {
      console.log(
        chalk.green("All done!")
      )
    }
  })
  





};
