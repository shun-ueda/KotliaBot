import Discord from 'discord.js';
import { performance } from 'perf_hooks';
import chalkpkg from 'chalk';
const chalk = chalkpkg;
import xmlpkg from 'xml-js';
const { convert } = xmlpkg;
import draftpkg from 'draftlog';
const { draftLog } = draftpkg.into(console);
//import packagejson from '../package.json';
import * as CONST from './lib/const.mjs';
import { Roman } from './modules/Roman.mjs';
import { get } from './modules/ajax.mjs';
import logpkg from 'logplease';
import { voteEmbedCreate } from './modules/VoteEmbed.mjs';
import Database from 'better-sqlite3';
import { ProgressBar } from './modules/ProgressBar.mjs';
let logger = logpkg.create('', { filename: '../log/chat.log' });
import settings from '../settings.json';
const db = new Database('../assets/Data.db', {});

Object.entries(CONST).forEach(([name, exported]) => (global[name] = exported));

export const sendWebhook = (
  icon = 'consoleIcon',
  username = 'Kotlia@CONSOLE',
  string = undefined,
  option = 'oyasai'
) => {
  /**
   * @returns { void }
   */
  if (option == 'kotlia') {
    WH_KOTLIA.send(string, {
      username: username,
      avatarURL: icon,
    });
  } else {
    WH_OYASAI.send(string, {
      username: username,
      avatarURL: icon,
    });
  }
};
export const memoryUsed = () => {
  /**
   * @returns { number }
   */
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  return Math.round(100 * used) / 100;
};
export const onStart = () => {
  /**
   * @returns { void }
   */
  const now = performance.now();
  console.clear();
  topicUpdate();
  const end = performance.now();
  console.log('\n\nWelcome to Translate Dis!\n\n');
  logger.info(`Translate-Dis is now ON! Loaded with ${Math.round(100 * (end - now)) / 100} ms\n\n`);
  //console.clear()
  //console.log('\n')
  //console.log('/￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣  SYSTEM CONSOLE ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣\\')
  //let draft = console.draft()
  //let sec = 0;
  //setInterval( () => {
  //    sec++
  //}, 1000)
  //setInterval( () => {
  //    let mem = memoryUsed().toPrecision(4);
  //    if (mem<10) {
  //        draft(chalk.bgBlackBright.magentaBright.bold(` VERSION `),`Node.js ${process.version}`,'    ',chalk.bgBlackBright.green.bold(`   RAM   `),mem,'MB','    ',chalk.bgBlackBright.cyanBright.bold(` UPTIME `),sec,'sec','    ',chalk.bgBlackBright.yellowBright.bold(` GIT VERSION `),`Translate Dis! v${packagejson.version}`)
  //    } else if (mem<20) {
  //        draft(chalk.bgBlackBright.magentaBright.bold(` VERSION `),`Node.js ${process.version}`,'    ',chalk.bgBlackBright.yellow.bold(`   RAM   `),mem,'MB','    ',chalk.bgBlackBright.cyanBright.bold(` UPTIME `),sec,'sec','    ',chalk.bgBlackBright.yellowBright.bold(` GIT VERSION `),`Translate Dis! v${packagejson.version}`)
  //    } else {
  //        draft(chalk.bgBlackBright.magentaBright.bold(` VERSION `),`Node.js ${process.version}`,'    ',chalk.bgBlackBright.red.bold(`   RAM   `),mem,'MB','    ',chalk.bgBlackBright.cyanBright.bold(` UPTIME `),sec,'sec','    ',chalk.bgBlackBright.yellowBright.bold(` GIT VERSION `),`Translate Dis! v${packagejson.version}`)
  //    }
  //}, 1)
  //console.log('\\_____________________________________________________________________________________________________________/')
  //console.log((process.version=='v14.5.0') ? '\n' : chalk.bgRedBright.bold('[!]Warn: システム推奨環境: Node.js v14.5.0\n'))
};
export const langDetect = (str) => {
  /**
   * @returns {String}
   */
  let layerUrl =
    'http://api.languagelayer.com/detect?access_key=1f315019080a70a8ee3b755b66ce309f&query=' +
    encodeURIComponent(str);
  let lang;
  try {
    lang = JSON.parse('[' + get(layerUrl) + ']')[0].results[0].language_code;
  } catch (error) {
    logger.error('Language not detected @ utils.mjs-68');
    return;
  }
  return lang;
};
export const topicUpdate = () => {
  /**
   * @returns { void }
   */
  let mem = memoryUsed();
  logger = logpkg.create('[ CONSOLE ] ', { filename: '../log/chat.log' });
  client.channels
    .fetch('717859267968892930')
    .then((channel) =>
      channel.setTopic(`/ch join japanese   |   KotliaBot Memory Usage: ${mem} MB`)
    )
    .then(logger.info(`Channel topic updated successfully with ${mem}`));
};
export const combinationProcess = (messageObject, option) => {
  /**
   * @returns { String }
   */
  const avatar = `https://minotar.net/helm/${messageObject.author.username}`;
  messageObject.delete();
  logger = logpkg.create(messageObject.author.username, { filename: '../log/chat.log' });
  if (option == 'toJa') {
    sendWebhook(
      avatar,
      messageObject.author.username,
      `${new Roman(messageObject.content).toJa()}   \`${messageObject.content}\``,
      'oyasai'
    );
    logger.debug(`${new Roman(messageObject.content).toJa()} (${messageObject.content})`);
  } else if (option == 'toKanji') {
    sendWebhook(
      avatar,
      messageObject.author.username,
      `${new Roman(messageObject.content).toKanji()}   \`${messageObject.content}\``,
      'oyasai'
    );
    logger.log(`${new Roman(messageObject.content).toKanji()} (${messageObject.content})`);
  } else {
    logger.error(msg);
  }
};
export const rankAnnounce = (msg) => {
  let data = msg.substring(msg.indexOf('user ') + 5);
  let name = data.substring(0, data.indexOf(' '));
  let rank = data.substring(data.indexOf('add') + 4);
  switch (rank) {
    case 'chukyu':
      rank = '中級';
      break;
    case 'jokyu':
      rank = '上級';
      break;
    case 'builder':
      rank = '建築士';
      break;
    case 'takumi':
      rank = '匠';
      break;
    case 'blue':
      rank = '青匠';
      break;
    case 'we':
      rank = 'クリエ・WE';
    default:
      break;
  }
  rank = rank.substring(0, rank.indexOf('[') - 1);
  rank.replace('chukyu', '中級');
  rank.replace('jokyu', '上級');
  rank.replace('builder', '建築士');
  rank.replace('takumi', '匠');
  rank.replace('blue', '青匠');
  rank.replace('we', 'クリエ・WE');

  client.channels.cache.get(OYASAI.RANK).send(`${name}\n${rank}`);
};
export const voteRecieved = (msg) => {
  let Time = Date.now();
  let name = msg.substring(msg.indexOf('username:') + 9, msg.indexOf('address') - 1);
  let embed;
  if (msg.includes('v1')) {
    embed = voteEmbedCreate('JMS', name);
  } else if (msg.includes('v2')) {
    embed = voteEmbedCreate('Mono', name);
  }
  let currentVote = db.prepare('SELECT * FROM CurrentVote WHERE ID = ?').get(1).CurrentVote + 1;
  db.prepare('UPDATE CurrentVote SET CurrentVote = ? WHERE ID = ?').run(currentVote, 1);
  //embed.setDescription(`ゴール達成まであと: **${settings.Community_Goal.Max-currentVote}** 票`)
  embed.addFields({
    name: `現在の進捗 (${currentVote}/${settings.Community_Goal.Max})`,
    value: new ProgressBar(currentVote, settings.Community_Goal.Max, 20).createBar(),
  });

  try {
    let data = db.prepare('SELECT * FROM Vote WHERE name = ?').get(name);
    let score = data.Sum + 1;
    let repeat = data.Repeat + 1;
    let time = data.Time;
    if (score == settings.Community_Goal.Max) {
      client.channels.cache
        .get('604935669952806944')
        .send('<@682967623595851796> コミュニティーゴール達成したようですねぇ...');
      client.channels.cache.get(OYASAI.MCCONSOLE).send(settings.Community_Goal.Command);
      db.prepare('UPDATE CurrentVote SET CurrentVote = ? WHERE ID = ?').run(0, 1);
    }
    db.prepare('UPDATE Vote SET Sum = ? WHERE Name = ?').run(score, name);
    if (Date.now() - time < 172800000) {
      db.prepare('UPDATE Vote SET Repeat = ? WHERE Name = ?').run(repeat, name);
      embed.setTitle(embed.title.replace('初', `${repeat}連続`));
    } else {
      db.prepare('UPDATE Vote SET Repeat = ? WHERE Name = ?').run(0, name);
    }
  } catch (error) {
    const insert = db.transaction((Vote) => {
      for (const el of Vote)
        db.prepare(
          'INSERT INTO Vote (Time, Name, Repeat, Sum) VALUES (@Time, @Name, @Repeat, @Sum)'
        ).run(el);
    });
    insert([{ Time: Time, Name: name, Repeat: 1, Sum: 1 }]);
    logger.info(`New player cache created for ${name}`);
  }
  logger.info(`Voter's data was updated for ${name}`);
  client.channels.cache.get(OYASAI.MCJA).send({ embed });
};
export const mcconsoleLog = (msg) => {
  if (msg.includes('/lp') && msg.includes('parent add')) {
    rankAnnounce(msg);
    return;
  } else if (msg.includes('Got a protocol v')) {
    voteRecieved(msg);
  }
};
