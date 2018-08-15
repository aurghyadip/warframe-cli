const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Items = require('warframe-items');

mods = new Items({category: ['Mods']})

program.command('find <mod_name>')
  .action((mod_name) => {
    mods.forEach((mod) => {
      if(mod.name === mod_name) {
        console.log(mod.name);
        console.log(mod.description);
        if (mod.hasOwnProperty('drops')) {
          mod.drops.forEach((drop) => {
            console.log(drop.location);
          })
        }
      }
    });
  });

program.parse(process.argv)