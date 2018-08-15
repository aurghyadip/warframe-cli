const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log
const Items = require('warframe-items');
const columns = require('cli-columns');
const wrap = require('wordwrap')(70);
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

program.command('mod <mod_name>')
  .action((mod_name) => {
    mods.forEach((mod) => {
      if(mod.name === mod_name) {
        log(chalk.blue(mod.name.toUpperCase()));
        log('Description : ' + mod.description);
        log('Polarity : ' + mod.polarity)
        if (mod.hasOwnProperty('drops')) {
          log(chalk.red('DROPS FROM :'));
          drops = [];
          mod.drops.forEach((drop) => {
            chance = drop.chance * 100;
            drops.push(drop.location + ' - ' + drop.rarity + '(' + chance.toString() + '%)');
          })
          log(columns(drops));
        }
      }
    });
  });

program.command('warframe <warframe_name>')
  .option('--abilities', 'Lists the abilities of the warframe')
  .option('--attributes', 'Displays the stats of the warframe')
  .option('--drops', 'Displays the parts drop locations of the warframe')
  .action((warframe_name, cmd) => {
    warframes.forEach((warframe) => {
      if(warframe.name.toLowerCase() === warframe_name.toLowerCase()) {
        if(cmd.attributes) {
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
        }

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
                  drops.push(drop.location + '(' + chance.toString() + '%)');
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