import { MessageEmbed } from 'discord.js';

const defEmojiList = [
	'\u0031\u20E3',
	'\u0032\u20E3',
	'\u0033\u20E3',
	'\u0034\u20E3',
	'\u0035\u20E3',
	'\u0036\u20E3',
	'\u0037\u20E3',
	'\u0038\u20E3',
	'\u0039\u20E3',
	'\uD83D\uDD1F'
];

export const pollEmbed = async (msg, title, options, timeout = 30, emojiList = defEmojiList.slice(), forceEndPollEmoji = '\u2705') => {
    try {
        if (!msg && !msg.channel) return msg.reply('**エラーコード01** チャンネルにアクセス出来ません。');
        if (!title) return msg.reply('**エラーコード02** タイトルが未定義です。');
        if (!options) return msg.reply('**エラーコード03** オプションが未定義です。');
        if (options.length < 2) return msg.reply('**エラーコード03** １つ以上のオプションを定義して下さい。');
        if (options.length > emojiList.length) return msg.reply(`${emojiList.length} 以下のオプションを定義して下さい。`);
    
        let text = (timeout==0) ? `リアクションを押して投票して下さい。\n**二回投票をしないで下さい。ガチでBotが停止します（原因不明）。誰が投票したのか分かります。**\nアンケート作成者は ${forceEndPollEmoji} をクリックすることによって **強制的** に終了出来ます。\n\n` : `リアクションを押して投票して下さい。\n**二回投票をしないで下さい。ガチでBotが停止します（原因不明）。誰が投票したのか分かります。**\n\n投票は後 **${timeout} 秒で終了します。**.\nアンケート作成者は ${forceEndPollEmoji} をクリックすることによって **強制的** に終了出来ます。\n\n`;
        const emojiInfo = {};
        for (const option of options) {
            const emoji = emojiList.splice(0, 1);
            emojiInfo[emoji] = { option: option, votes: 0 };
            text += `${emoji} : \`${option}\`\n\n`;
        }
        const usedEmojis = Object.keys(emojiInfo);
        usedEmojis.push(forceEndPollEmoji);
    
        const poll = await msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text));
        for (const emoji of usedEmojis) await poll.react(emoji);
    
        const reactionCollector = poll.createReactionCollector(
            (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
            timeout === 0 ? {} : { time: timeout * 1000 }
        );
        const voterInfo = new Map();
        reactionCollector.on('collect', (reaction, user) => {
            if (usedEmojis.includes(reaction.emoji.name)) {
                if (reaction.emoji.name === forceEndPollEmoji && msg.author.id === user.id) return reactionCollector.stop();
                if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name });
                const votedEmoji = voterInfo.get(user.id).emoji;
                if (votedEmoji !== reaction.emoji.name) {
                    let lastVote;
                    try {
                        lastVote = poll.reactions.get(votedEmoji);
                        lastVote.count -= 1;
                        lastVote.users.remove(user.id);
                    } catch (error) {
                        
                    }
                    emojiInfo[votedEmoji].votes -= 1;
                    voterInfo.set(user.id, { emoji: reaction.emoji.name });
                }
                emojiInfo[reaction.emoji.name].votes += 1;
            }
        });
    
        reactionCollector.on('dispose', (reaction, user) => {
            if (usedEmojis.includes(reaction.emoji.name)) {
                voterInfo.delete(user.id);
                emojiInfo[reaction.emoji.name].votes -= 1;
            }
        });
    
        reactionCollector.on('end', () => {
            text = '*カン！カン！カン！！投票終了！！\n 結果発表：*\n\n';
            for (const emoji in emojiInfo) text += `\`${emojiInfo[emoji].option}\` - \`${emojiInfo[emoji].votes}\`\n\n`;
            poll.delete();
            msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text));
        });
    } catch (error) {
        
    }
};

const embedBuilder = (title, author) => {
	return new MessageEmbed()
		.setTitle(`投票 - ${title}`)
		.setFooter(`${author} が作成`);
};