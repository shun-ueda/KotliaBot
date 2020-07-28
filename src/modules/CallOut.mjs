import execpkg from 'child_process';
const exec = execpkg.execSync;

export const CallOut = (message) => {
    let queue = [];
    queue.push(message);
    exec(`curl "https://api.voicetext.jp/v1/tts" -o "../assets/voice.mp3" -u "t93swztjbyocvcmv:" -d "text=${encodeURIComponent(msg)}" -d "speaker=show" -d "pitch=150" -d "speed=110"`)
    voiceConnection.play('../assets/voice.mp3')
}