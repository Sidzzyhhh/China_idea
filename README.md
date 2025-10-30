# 小诺方向盘

一套深色极简的中文问答网站，帮助在多个去向之间摇摆的用户快速对齐直觉。所有页面均可直接通过静态服务器访问，无需 IDE 预览或后端依赖。

## 目录结构

```
/index.html        # 首页：价值主张 + CTA
/quiz.html         # 问答页：引导、问答流程、结果
/learn.html        # 资讯页：资源卡片集合
/styles.css        # 全站样式与设计令牌
/app.js            # 问答逻辑、评分模型、分享逻辑
/brand/mascot.svg  # 小诺（Navigator Nori）形象
/assets/flags/     # us.svg / cn.svg / globe.svg
/tests/unit.test.js# Node 原生断言测试
```

## 启动与运行

使用任意静态服务器即可本地预览：

```bash
python -m http.server 8000
# 或
npx serve -l 8000 .
```

浏览器访问 `http://localhost:8000/index.html`，通过导航进入问答与资讯页面。

## 单元测试

所有测试依赖 Node 自带的 `assert`，无需额外依赖。

```bash
npm test
```

测试覆盖：
- 单版式守护：每页仅有一个导航、英雄、矩阵卡片/进度条等结构；
- 特征映射与线性回归评分；
- 分享链接序列化/反序列化；
- 空答案的鲁棒性。

## 自检清单

- [ ] 首页、问答页、资讯页各自仅保留一套导航、英雄、核心模块；
- [ ] 问答为逐题问答，绝无自行打分控件；
- [ ] 结果页可复制分享链接、触发打印、重新开始；
- [ ] 访问 `quiz.html?a=...#result` 能复现分享结果；
- [ ] 系统在 `prefers-reduced-motion` 下停用动画与上浮效果。

## 额外说明

为保证仓库轻量化，本项目只提供 SVG 资源；若部署环境需要 Apple Touch Icon，可在私有仓库添加或通过 `data:` URL 动态注入。
