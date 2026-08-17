// dsh-cnwrite / test.mjs —— 逻辑自测（不需要安装 DSH）
// 运行：node test.mjs

import { polishText, statsText } from './lib.js'

let passed = 0
let failed = 0

function check(name, actual, expected) {
  if (actual === expected) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}`)
    console.log(`    期望: ${JSON.stringify(expected)}`)
    console.log(`    实际: ${JSON.stringify(actual)}`)
  }
}

console.log('== 排版 cn_polish ==')

check(
  '中英文之间补空格',
  polishText('今天学了Python和GPT5'),
  '今天学了 Python 和 GPT5'
)

check(
  '已有空格不重复',
  polishText('今天学了 Python'),
  '今天学了 Python'
)

check(
  '半角逗号句号改全角',
  polishText('你好,世界.再见'),
  '你好，世界。再见'
)

check(
  '小数点不受影响',
  polishText('圆周率是3.14,知道吗?'),
  '圆周率是 3.14，知道吗？'
)

check(
  'URL 不受影响',
  polishText('详见https://example.com/a.b页面'),
  '详见 https://example.com/a.b 页面'
)

check(
  '英文引号转中文引号',
  polishText('他说"你好"然后走了'),
  '他说「你好」然后走了'
)

check(
  '多个空行压缩为一个',
  polishText('第一段\n\n\n\n第二段'),
  '第一段\n\n第二段'
)

check(
  '行尾空格清理',
  polishText('行尾有空格   \n下一行'),
  '行尾有空格\n下一行'
)

check(
  '冒号分号感叹号',
  polishText('提示:注意;太好了!'),
  '提示：注意；太好了！'
)

console.log('== 统计 cn_stats ==')

const demo =
  '人工智能正在改变世界。AI tools are everywhere!\n\n第二段：2026 年是个节点,3.14 不再只是圆周率。'

const s = statsText(demo)
check('段落数', s.段落数, 2)
check('英文单词数（AI tools are everywhere）', s.英文单词数, 4)
check('数字串（2026 和 3.14）', s.数字串个数, 2)
check('阅读时长最少 1 分钟', s.预估阅读时长_分钟 >= 1, true)

console.log(`\n结果: ${passed} 通过, ${failed} 失败`)
process.exit(failed ? 1 : 0)
