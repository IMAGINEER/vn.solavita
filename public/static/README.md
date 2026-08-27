# 静态资源文件夹

此文件夹用于存放 Solavita 落地页的图片和视频资源。

## 文件夹结构

```
public/static/
├── images/          # 图片资源
│   ├── hero/        # 首屏大图
│   ├── products/    # 产品图片
│   ├── features/    # 功能图示
│   └── brand/       # 品牌相关图片
├── videos/          # 视频资源
│   ├── product/     # 产品视频
│   └── demo/        # Demo 演示
└── documents/        # PDF 文档（如数据手册）
    ├── datasheets/   # 产品数据手册
    └── brochures/   # 产品手册
```

## 使用方式

在代码中引用：
```tsx
// 图片
import heroImage from '@/public/static/images/hero/example.jpg'
<img src="/static/images/hero/example.jpg" />

// 视频
<video src="/static/videos/demo.mp4" />
```

## 推荐资源

建议添加以下资源：
- Hero 背景图：德国别墅屋顶光伏实装照片
- 产品渲染图：Solar 模块、电池、Wechselrichter
- App 界面截图：HEMS 演示
- 品牌素材：Skyworth、Metz、Solavita Logo
