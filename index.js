// dsh-cnwrite / index.js —— 插件入口（薄壳）
// 纯逻辑在 lib.js，这里只负责把两个函数注册成 DSH 工具。

import { defineTool } from '@deepseek-ai/dsh-tools'
import { polishText, statsText } from './lib.js'

export const name = 'cnwrite' // 插件内部名，与 cordis.patch.yml 的 id 对应
export const inject = ['tools'] // 依赖声明：等工具注册表就绪后，apply 才会执行

export function apply(ctx) {
  // 工具一：中文排版
  ctx.tools.register(
    defineTool({
      name: 'cn_polish',
      description:
        '中文文案排版：自动在中英文之间补空格，把中文旁边的半角标点改成全角，统一中文引号，压缩多余空行。适合处理将要发布的文章、公众号稿、报告。',
      parameters: {
        text: { type: 'string', required: true, description: '需要排版的中文文本' },
      },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) {
        return polishText(args.text)
      },
    })
  )

  // 工具二：写作统计
  ctx.tools.register(
    defineTool({
      name: 'cn_stats',
      description:
        '统计中文文本的写作数据：总字数、中文字符数、英文单词数、段落与句子数量、预估阅读时长。适合估算稿费字数、评估文章长度。',
      parameters: {
        text: { type: 'string', required: true, description: '需要统计的中文文本' },
      },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) {
        const s = statsText(args.text)
        return Object.entries(s)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      },
    })
  )

  console.log('[cnwrite] 中文写作助手已加载：cn_polish / cn_stats')
}
