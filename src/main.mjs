import Discord from 'discord.js';
import { performance } from 'perf_hooks';
import chalkpkg from 'chalk';
import xmlpkg from 'xml-js';
import draftpkg from 'draftlog';
import packagejson from '../package.json';
import * as CONST from './lib/const.mjs';
import * as UTIL from './utils.mjs';
import { Roman } from './modules/Roman.mjs';
import readlinepkg from 'readline';
import { pollEmbed } from './modules/PollEmbed.mjs';
import logpkg from 'logplease';
import { memoryUsed } from './utils.mjs';
import execpkg from 'child_process';
import fs from 'fs';
import { client } from './lib/const.mjs';
const exec = execpkg.execSync;
const readline = readlinepkg.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let logger = logpkg.create('');
const { draftLog } = draftpkg.into(console);
const { convert } = xmlpkg;
const chalk = chalkpkg;
Object.entries(CONST).forEach(([name, exported]) => (global[name] = exported));
Object.entries(UTIL).forEach(([name, exported]) => (global[name] = exported));

client.login(CLIENT_SECRET);

let voiceConnection;
client.on('ready', async () => {
  onStart();
  //client.user.setActivity('Discord.js', { type: 'PLAYING' });
  setInterval(userActivity, 10000);
  function userActivity() {
    let str = `${memoryUsed()} MB 食ってます`;
    while (str.length < 20) {
      str += '.';
    }
    client.user.setActivity(str);
  }
  voiceConnection = await client.channels.cache.get('605074803887702032').join();
});

let cnt = 0;
let queue = [];
let dispatcher;
client.on('message', async (message) => {
  const msg = message.content;
  const ngInConsole = ['hologram', 'Could not pass'];

  if (message.channel.id == '621679759218180126') {
    if (msg.startsWith('/')) {
      let com = msg.substring(1);
      if (com.includes('move')) {
        if (com.includes('1')) {
          voiceConnection = await client.channels.cache.get('605074803887702032').join();
        } else if (com.includes('2')) {
          voiceConnection = await client.channels.cache.get('634132269472284675').join();
        } else if (com.includes('3')) {
          voiceConnection = await client.channels.cache.get('663349348121182223').join();
        } else if (com.includes('admin')) {
          voiceConnection = await client.channels.cache.get('643375239576813589').join();
        }
        return;
      }
      let onoff = true;
      if (com == 'on') {
        onoff = true;
      } else if (com == 'off') {
        onoff = false;
      }
      if (!onoff) {
        //leave
      }
      return;
    }
    try {
      if (msg.length > 150) {
        message.reply('文章が長すぎんよ～');
      } else {
        queue.push(msg);
        if (queue.length >= 2) return;
        voiceOut(queue);
        function voiceOut(queue) {
          if (queue[0] == '114514') {
            dispatcher = voiceConnection.play('../assets/いいよ.mp3');
          } else if (queue[0] == 'ファッ！？') {
            dispatcher = voiceConnection.play('../assets/ファッ！？.mp3');
          } else if (queue[0] == 'イキスギ') {
            dispatcher = voiceConnection.play('../assets/イキスギ.mp3');
          } else if (queue[0] == 'ま、多少はね？') {
            dispatcher = voiceConnection.play('../assets/ま、多少はね？.mp3');
          } else {
            console.log('executed')
            exec(
              `curl "https://api.voicetext.jp/v1/tts" -o "../assets/voice.mp3" -u "t93swztjbyocvcmv:" -d "text=${encodeURIComponent(
                queue[0]
              )}" -d "speaker=show" -d "pitch=150" -d "speed=160"`
            );
            dispatcher = voiceConnection.play('../assets/voice.mp3');
          }
          dispatcher.on('finish', () => {
            if (queue.length >= 2) {
              queue.shift();
              voiceOut(queue);
              return;
            }
            queue.shift();
          });
        }
      }
    } catch (error) {
      return;
    }
  } else if (message.channel.id=='721673101775208568') {
    if (message.author.id == '682967623595851796') {
      client.channels.cache.get(OYASAI.MCCONSOLE).send(msg);
    } else {}
  } else if (message.channel.id == OYASAI.MCCONSOLE) {
    if (message.author.id == '730353449337880628') { message.delete()
    } else client.channels.cache.get('721673101775208568').send(msg);
    if (
      !new RegExp(ngInConsole.join('|')).test(msg) &&
      !msg.includes('Discord |') &&
      !msg.includes('[lang]')
    ) {
      client.channels.cache.get(KOTLIA.CONSOLE).send(msg);
    }
  } else if (message.channel.id == KOTLIA.CONSOLE) {
    mcconsoleLog(msg);
  } else if (message.webhookID != null && !msg.includes('`')) {
    if (message.channel.id == OYASAI.MCJA) {
      if (msg.startsWith('-')) {
        //翻訳
      } else if (REG_JA.test(msg) || NUM.test(msg) || !WREP.test(msg)) {
        let logger = logpkg.create(message.author.username, {
          filename: '../log/mcconsole.log',
        });
        logger.log(msg);
      } else if (REG_EN.test(msg)) {
        combinationProcess(
          message,
          msg.includes(' ') && langDetect(msg) == 'en' ? 'toJa' : 'toKanji'
        );
      }
    }
  } else if (message.webhookID == null && message.channel.id == OYASAI.MCJA) {
    let logger = logpkg.create(`${message.author.username} @ DISCORD`, {
      filename: '../log/mcconsole.log',
    });
    logger.log(msg);
  }
});

client.on('channelUpdate', (message) => {
  topicUpdate();
});

readline.on('line', (input) => {
  if (input.startsWith('js:')) {
    eval(input.substring(3));
    return;
  }
  sendWebhook(ICON, 'Kotlia@Console', input, 'oyasai');
});
