const logUpdate = require('log-update');
const record = require('./node-record-lpcm16');
const Speech = require('@google-cloud/speech');
const chalk = require('chalk');

let totalKeyword = 0;

function streamingMicRecognize({ encoding = 'LINEAR16', sampleRateHertz = 16000, languageCode = 'ko-KR', keyword }) {
    const recognizeStream = Speech().streamingRecognize({
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode
        },
        interimResults: true
    })
        .on('error', () => streamingMicRecognize({ keyword, encoding, languageCode, sampleRateHertz }))
        .on('data', (data) => {
            if (!(data.results[0] && data.results[0].alternatives[0])) return

            const text = data.results[0].alternatives[0].transcript
            logUpdate(text)
            if (!data.results[0].isFinal) return
            logUpdate.done()
            totalKeyword += text.split(keyword).length - 1
            console.log(`
"${keyword}"이 들어간 횟수: ${text.split(keyword).length - 1}
지금까지 총합: ${chalk.blue(totalKeyword)}
`)
        })

    record
        .start({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            verbose: false,
            recordProgram: 'sox',
            silence: '10.0'
        })
        .on('error', console.error)
        .pipe(recognizeStream);
}

console.log(`Captureing for keyword "${process.argv.slice(2)}". Ctrl+C to stop.`);

streamingMicRecognize({
    keyword: process.argv.slice(2)
})
