import { tree } from '../lib/tree.mjs';
import { get } from './Ajax.mjs';
import chalk from 'chalk';
import logpkg from 'logplease';
const logger = logpkg.create('utils');
export class Roman {
    /**
     * @param { String } original - Original Message
     * @returns { String } { string } : Translate/ transiliterated
     */
    constructor(original) {
        this.original = original;
    };
    toRoman() {
        const str = this.original.replace(/[Ａ-Ｚａ-ｚ]/, s => String.fromCharCode(s.charCodeAt(0) - 65248)); // 全角→半角→小文字
        let result = '';
        let tmp = '';
        let index = 0;
        const len = str.length;
        let node = tree;
        const push = (char, toRoot = true) => {
            result += char;
            tmp = '';
            node = toRoot ? tree : node;
        };
        while (index < len) {
            const char = str.charAt(index);
            if (char.match(/[a-z]/)) { // 英数字以外は考慮しない
                if (char in node) {
                    const next = node[char];
                    if (typeof next === 'string') {
                        push(next);
                    } else {
                        tmp += this.original.charAt(index);
                        node = next;
                    }
                    index++;
                    continue;
                }
                const prev = str.charAt(index - 1);
                if (prev && (prev === 'n' || prev === char)) { // 促音やnへの対応
                    push(prev === 'n' ? 'ン' : 'ッ', false);
                }
                if (node !== tree && char in tree) { // 今のノードがルート以外だった場合、仕切り直してチェックする
                    push(tmp);
                    continue;
                }
            }
            push(tmp + char);
            index++;
        }
        tmp = tmp.replace(/n$/, 'ン'); // 末尾のnは変換する
        push(tmp);
        return result;
    };
    toKanji() {
        let arr;
        let str = new Roman(this.original).toRoman();
        try {
            arr = JSON.parse(get(`http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(str)}`));
        } catch (error) {
            console.log(chalk.red(`JSON ERROR at roman.mjs\n${error}`))
        }
        let out = '';
        try {
            arr.forEach(el => out += el[1][0])
        } catch (error) {
            return;
        }
        return out;
    };
    toEn() {
        let out = "";
        let trEn;
        try {
            trEn = JSON.parse("[" + get("https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=" + encodeURIComponent(this.original) + "&ie=UTF-8&oe=UTF-8") + "]");
            for (let i=0;i<trEn[0][0].length;i++) {
                out += trEn[0][0][i][0];
              }
            return out;
        } catch (error) {
            return;
        }
    };
    toJa() {
        let out = "";
        let trJa;
        try {
            trJa = JSON.parse("[" + get("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=" + encodeURIComponent(this.original) + "&ie=UTF-8&oe=UTF-8") + "]");
        } catch (error) {
            return;
        }
        for (let i=0;i<trJa[0][0].length;i++) {
          out += trJa[0][0][i][0];
        }
        return out;
    };
}