import { JMS_URL } from "../lib/const.mjs"
import { MONO_URL } from "../lib/const.mjs"
import settings from '../../settings.json';

import Discord from 'Discord.js'

export const voteEmbedCreate = (server,name,) => {

    /**
     * @param { String } server;
    */
   let VOTE_EMBED =  new Discord.MessageEmbed();
    const avatar = `https://minotar.net/avatar/${name}`;
    VOTE_EMBED
    .setTitle(`${name}さん、初投票ありがとナス！！`)
    .attachFiles([`../../translate_dis/assets/${settings.Community_Goal.Prize_icon}`])
    .setFooter(`次のプライズ: ${settings.Community_Goal.Prize_description}`,`attachment://${settings.Community_Goal.Prize_icon}`)
    
    if (server == 'Mono') {
        VOTE_EMBED
        .setColor('#4C7B57')
        .setURL(MONO_URL)
        .attachFiles(['../../translate_dis/assets/Monocraft.jpg'])
        .setAuthor('Monocraft.net','attachment://Monocraft.jpg',MONO_URL)
        .setThumbnail(avatar)
        .setTimestamp()
    } else {
        VOTE_EMBED
        .setColor('#48EEDA')
        .setURL(JMS_URL)
        .attachFiles(['../../translate_dis/assets/Diamond.png'])
        .setAuthor('Minecraft.jp','attachment://Diamond.png',JMS_URL)
        .setThumbnail(avatar)
        .setTimestamp()
    }
    return VOTE_EMBED
}