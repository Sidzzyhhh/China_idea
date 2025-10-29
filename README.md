# 小诺导航

一套极简深色风格的静态网站，帮留学生用问答流程梳理「留美 / 回国 / 第三地」的去向选择。包含首页、问答页和资讯页，可直接通过任意静态服务器部署。

## 快速开始

无需安装依赖，直接使用以下任一命令启动本地静态服务：

```bash
npx serve -l 8000 .
```

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000/index.html>。

## 运行单元测试

```bash
npm test
```

该命令会先执行仓库无二进制资源检查（`tests/no-binary.test.js`），随后运行评分逻辑相关的单元测试（`tests/unit.test.js`）。

## 预览 / 部署

项目为原生 HTML/CSS/JS，可部署到任意静态托管（GitHub Pages、Vercel Static、Netlify Drop 等）。如需本地演示生产效果，可执行：

```bash
npm run preview
```

> 由于仓库策略不提交 PNG/ICO 等二进制文件，未附带 Apple Touch Icon 与 manifest 图标。如在部署环境需要，可通过 data:URL 动态注入或在允许二进制资源的私有仓库补充。

## 评分模型

问答页会把每题的选择映射到特征向量，经由内部权重矩阵和偏置计算 softmax，得到三个去向的概率，并生成口语化理由。答案可序列化到 URL 中（`?a=` 参数），支持分享和再次加载。

## 自检清单

- [ ] 可访问性：Skip Link、焦点样式、ARIA 状态检查通过。
- [ ] 动效尊重 `prefers-reduced-motion`。
- [ ] 路由参数：`#start`、`?suggest=`、`?a=...#result` 行为符合预期。
- [ ] 分享链接可复制并还原问答结果。
- [ ] 打印样式隐藏多余按钮，仅保留结果要点。
- [ ] Lighthouse 四项（Performance/Accessibility/Best Practices/SEO）≥ 90。
