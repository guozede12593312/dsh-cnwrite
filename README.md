# dsh-cnwrite · 中文写作助手

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件，为 AI 对话补上中文写作的两个刚需工具：

- **cn_polish** —— 中文排版：自动在中英文之间补空格、把中文旁的半角标点改成全角、统一中文引号「」、压缩多余空行。小数点（3.14）和 URL 不会被误伤。
- **cn_stats** —— 写作统计：总字数、中文字符数、英文单词数、段落/句子数、预估阅读时长。适合估算稿费字数、评估文章长度。

## 为什么安全

纯本地文本计算：**不联网、不读文件、不碰凭据、不需要任何 API 密钥**，整个插件没有任何网络请求。核心逻辑在 [lib.js](lib.js)（约 100 行纯函数），欢迎审计。

## 安装

```sh
dsh plugin --profile web add github:你的用户名/dsh-cnwrite
```

本插件为纯 JavaScript、无构建步骤，从 GitHub 安装时不会执行任何构建脚本。

## 使用

启动后在对话框直接说：

> 用 cn_polish 排版这段文字：「人工智能正在改变世界,AI tools are everywhere!」

> 用 cn_stats 统计这篇文章的字数和阅读时长：……

## 开发与测试

```sh
git clone https://github.com/你的用户名/dsh-cnwrite
cd dsh-cnwrite
npm install        # 本地 link 安装时需要手动装一次依赖
node test.mjs      # 13 项单元测试，无需 DSH 环境
```

本地调试（link 模式，改代码即时生效）：

```sh
dsh plugin --profile demo add /path/to/dsh-cnwrite
dsh --profile demo --dump-config   # 应看到 "# == dsh-cnwrite" 层
dsh web --port 3081
```

## 文件结构

```
dsh-cnwrite/
├── index.js            # 插件入口：注册 cn_polish / cn_stats 两个工具
├── lib.js              # 纯文本处理逻辑（可独立测试）
├── test.mjs            # 单元测试
├── cordis.patch.yml    # 插件层声明（对 dsh plugin 暴露）
└── package.json        # dsh.bundle 打包清单
```

## License

MIT
