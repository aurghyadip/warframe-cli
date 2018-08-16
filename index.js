#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log
const Items = require('warframe-items');
const columns = require('cli-columns');
const wrap = require('wordwrap')(process.stdout.columns);
const Table = require('cli-table');


mods = new Items({category: ['Mods']});
warframes = new Items({category : ['Warframes']});

function printSeparator() {
  s = '';
  for(i = 0; i < process.stdout.columns; i++) {
    s += '-';
  }
  log(s);
}

program.version('0.0.1');

program.command('mod <mod_name>')
  .description('Displays the information about a Mod.')
  .action((mod_name) => {
    mods.forEach((mod) => {
      if(mod.name === mod_name) {
        log(chalk.blue(mod.name.toUpperCase()));
        log('Description : ' + mod.description);
        const table = new Table();
        table.push(
          {'Polarity' : mod.polarity},
          {'Rarity' : mod.rarity},
          {'Base Drain' : mod.baseDrain},
          {'Max Rank' : mod.fusionLimit},
          {'Max Drain' : mod.baseDrain + mod.fusionLimit},
          {'Type' : mod.type}
        );
        log(table.toString())
        if (mod.hasOwnProperty('drops')) {
          log(chalk.red('DROPS FROM :'));
          drops = [];
          mod.drops.forEach((drop) => {
            chance = drop.chance * 100;
            drops.push(drop.location + ' - ' + drop.rarity + '(' + chance.toFixed(2).toString() + '%)');
          })
          log(columns(drops));
        }
      }
    });
  });

program.command('warframe <warframe_name>')
  .description('Displays the information about a warframe.')
  .option('--abilities', 'Lists the abilities of the warframe')
  .option('--drops', 'Displays the parts drop locations of the warframe')
  .action((warframe_name, cmd) => {
    warframes.forEach((warframe) => {
      if(warframe.name.toLowerCase() === warframe_name.toLowerCase()) {
        log(chalk.red(warframe.name.toUpperCase()));
        log(chalk.green(wrap(warframe.description)));
        log(chalk.yellow("\nPolarities : " + warframe.polarities.toString().toUpperCase()))
        log(chalk.yellow("Aura Polarity : " + warframe.aura.toUpperCase()))
        const table = new Table({
          head: ['Attribute', 'Value']
          , colWidths: [20, 20]
        });
        table.push(
          ['Health', warframe.health],
          ['Shield', warframe.shield],
          ['Armor', warframe.armor],
          ["Energy", warframe.power],
          ["Sprint Speed", warframe.sprint]
        );
        log(table.toString());

        if (cmd.abilities) {
          warframe.abilities.forEach((ability) => {
            log(chalk.red(ability.name));
            log(chalk.yellow(wrap(ability.description)));
            printSeparator();
          })
        }

        if(cmd.drops) {
          components = warframe.components;
          components.forEach((component) => {
            if(component.name != "Orokin Cell") {
              log(chalk.red(component.name.toUpperCase()));
              if (component.hasOwnProperty('drops')) {
                drops = [];
                component.drops.forEach((drop) => {
                  chance = drop.chance * 100
                  drops.push(drop.location + '(' + chance.toFixed(2).toString() + '%)');
                })
                log(columns(drops));
                printSeparator();
              }
              else {
                log(chalk.yellow("Obtainable from the market"));
                printSeparator();
              }
            }
          })
        }
      }
    })
  });

program.parse(process.argv)