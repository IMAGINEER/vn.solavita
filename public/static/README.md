# `public/static/` — 旧版资源目录（已弃用）

> 历史说明：本目录原用于集中存放 Solavita 落地页的图片与视频资源。
> **2026-09 迁移后，所有活跃资源已统一到 `public/images/` 与 `public/videos/`。**
> 本目录仍保留若干历史/备选资源（Metz、DE 母公司资产、未启用占位等），不在
> 活跃代码路径中。新资源请直接放 `public/images/`。

## 当前结构

```
public/
├── images/   # 所有活跃图片（迁移后唯一写入位置）
├── videos/   # 视频资源
└── static/   # 旧目录 —— 仅保留历史/未引用资源，详见下表
    ├── README.md        # 本文件
    ├── images/          # 未引用或备用图片（27 个文件，见 public/static/images/）
    ├── videos/          # 旧视频目录
    └── pdfs/            # 数据手册 PDF（多数组件仍在 /static/pdfs/ 引用，未迁移）
```

## 使用方式（迁移后）

代码里所有引用**已切到 `/images/`**：

```tsx
// 图片
import heroImage from '@/public/images/hero/example.jpg'
<img src="/images/hero/example.jpg" />

// 视频
<video src="/videos/demo.mp4" />
```

如果需要复活某个 `public/static/images/` 下的旧资源，请先把它移到 `public/images/`，
再更新代码里的引用路径（`/static/images/X` → `/images/X`），保持单一一处来源。

## 推荐资源

建议添加以下资源：
- Hero 背景图：德国别墅屋顶光伏实装照片
- 产品渲染图：Solar 模块、电池、Wechselrichter
- App 界面截图：HEMS 演示
- 品牌素材：Skyworth、Metz、Solavita Logo
