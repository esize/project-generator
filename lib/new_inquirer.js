const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

rmMacPresets = (arr) => {
  if (arr.includes(".DS_Store")) {
    var index = arr.indexOf('.DS_Store');
    arr.splice(index, 1);
  }
  return arr
}

module.exports = {

  rmMacPresets: (arr) => {
    return rmMacPresets(arr)
  },

  askCreationQuestions: (title) => {
    let questions = [
      {
        name: 'description',
        type: 'input',
        message: 'Description: ',
      },
      {
        name: 'license',
        type: 'list',
        message: 'License',
        choices: [
          {name: "MIT", value: 'mit'},
          {name: "No license", value: ''},
          {name: 'Apache license 2.0', value: 'apache-2.0'},
          {name: 'GNU General Public License v3.0', value: 'gpl-3.0'},
          {name: 'BSD 3-clause "New" or "Revised" license', value: 'bsd-3-clause'}
        ]
      }
    ]
    if (!title) {
      questions.unshift({
        name: 'name',
        type: 'input',
        message: 'Project name: ',
        validate: function (input) {
          if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
          else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
      })
    }

    let template_path = path.join(__dirname, '../templates')
    const template_types = fs.readdirSync(template_path);
    rmMacPresets(template_types)


    for (x in template_types) {
      let x_type = template_types[x]
      let options = fs.readdirSync(`${template_path}/${x_type}`)
      options.unshift("None")
      rmMacPresets(options);
      questions.push({
        name: x_type,
        type: 'list',
        message: x_type,
        choices: options
      })
    }
    return inquirer.prompt(questions);
  }

}
