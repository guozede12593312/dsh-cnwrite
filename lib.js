// dsh-cnwrite / lib.js —— 纯文本处理逻辑
// 本文件不依赖任何 DSH / Cordis 模块，可独立测试（node test.mjs）

const RE_HAN = /[\u4e00-\u9fa5]/ // 一个中文字符
const RE_LATIN = /[A-Za-z0-9]/ // 一个英文字母或数字

// 常见半角标点 → 全角（仅当紧邻中文时才转换，避免误伤 URL 和小数点）
const PUNCT_PAIRS = [
  [/,/g, '，'],
  [/;/g, '；'],
  [/:/g, '：'],
  [/\?/g, '？'],
  [/!/g, '！'],
]

export function polishText(raw) {
  let text = String(raw)

  // 1) 中英文之间补一个空格（已有空格不会重复匹配）
  text = text.replace(new RegExp(`(${RE_HAN.source})(${RE_LATIN.source})`, 'g'), '$1 $2')
  text = text.replace(new RegExp(`(${RE_LATIN.source})(${RE_HAN.source})`, 'g'), '$1 $2')

  // 2) 标点修正：中文旁边（前或后）的半角标点换成全角
  for (const [half, full] of PUNCT_PAIRS) {
    text = text
      .replace(new RegExp(`(${RE_HAN.source})\\s*${half.source}\\s*`, 'g'), `$1${full}`)
      .replace(new RegExp(`${half.source}\\s*(${RE_HAN.source})`, 'g'), `${full}$1`)
  }
  // 句点单独处理：避免把 3.14 或 example.com 改坏
  text = text
    .replace(new RegExp(`(${RE_HAN.source})\\s*\\.(?!\\d)`, 'g'), '$1。')
    .replace(new RegExp(`\\.(?=\\s*${RE_HAN.source})`, 'g'), '。')

  // 3) 引号统一为中文引号（成对出现时）
  text = text.replace(/"([^"\n]{1,200})"/g, '「$1」')

  // 4) 清理：行尾空格、制表符，3 个以上连续换行压成 1 个空行
  text = text
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return text
}

export function statsText(raw) {
  const text = String(raw)
  const cnChars = (text.match(new RegExp(RE_HAN.source, 'g')) || []).length
  const enWords = (text.match(/[A-Za-z]+/g) || []).length
  const digits = (text.match(/\d+(\.\d+)?/g) || []).length
  const noSpace = text.replace(/\s/g, '').length
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length
  const sentences = text.split(/[。！？!?;\n]+/).filter((s) => s.trim()).length

  // 阅读时长：中文约 300 字/分钟，英文约 200 词/分钟（成年人平均默读速度）
  const minutes = Math.max(1, Math.ceil(cnChars / 300 + enWords / 200))

  return {
    总字符数_含空白: text.length,
    总字符数_不含空白: noSpace,
    中文字符数: cnChars,
    英文单词数: enWords,
    数字串个数: digits,
    段落数: paragraphs,
    句子数: sentences,
    预估阅读时长_分钟: minutes,
  }
}
