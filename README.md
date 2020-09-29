# ListenCounter-NodeJS
Made with nodejs, node-record-lpcm16, GCP Cloud Speech to Text.

# So What is it??
Listen microphone and convert to text. and count specified word.

# Requirement
Tested on windows, runtime need to be with [SoX](https://github.com/chirlu/sox)
With other audio processor, you need to modify `./node-record-lpcm16`

# command
```
node recognize $keyword
```
language is defaultly Korean(ko-KR). You can listen other language that supported by GCP, by editing `index.ts`