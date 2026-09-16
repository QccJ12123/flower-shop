# 花卉百科网站 🌸
> 前端课程设计 | 多页面花卉模拟电商静态网站

在线预览：https://QccJ12123.github.io/flower-shop/Public/index.html
> PC端、移动端响应式适配

## 📷 页面截图
- 首页
- <img width="2930" height="1751" alt="image" src="https://github.com/user-attachments/assets/6ed0f08c-b8b3-46a0-a0de-f161a2baf863" />
- 花卉分类页
- <img width="2963" height="1737" alt="image" src="https://github.com/user-attachments/assets/a48e022a-9300-416c-84bf-60c700c9a783" />
- 商品详情页
- <img width="2946" height="1757" alt="image" src="https://github.com/user-attachments/assets/70a8e991-53af-4135-9da6-b710a240c0ed" />
- 购物车页面
- <img width="2927" height="1737" alt="image" src="https://github.com/user-attachments/assets/2eb0817f-1662-44bc-bcdb-405289e43b95" />

## ✨ 项目简介
本项目是基于 **HTML5 + CSS3 + JavaScript + Vue 2.6（CDN引入）** 开发的多页面静态花卉模拟电商网站，为前端课程设计作品。

项目独立完成需求分析、页面架构设计、页面跳转逻辑、内容体系规划（花卉分类、四季养护知识库）。页面布局与交互代码借助AI辅助生成，本人负责提示词编写、代码调试、BUG修复、样式美化与全部功能验证。

项目为纯前端演示项目，购物车数据、表单信息使用浏览器 `localStorage` 本地持久化存储，**无后端服务器、无数据库**，刷新页面购物车数据不会丢失。

## 📋 功能清单
- ✅ 多页面路由跳转：首页、花卉分类、商品详情、购物车、养护科普、关于我们
- ✅ 响应式布局：PC端与手机端自适应展示
- ✅ 购物车模块：添加商品、修改数量、删除商品、商品总价统计，跨页面同步购物车数量
- ✅ 加入购物车弹窗通知提示
- ✅ 导航菜单自动高亮当前页面
- ✅ FAQ问答折叠展开组件
- ✅ 四季花卉养护卡片Vue复用组件
- ✅ 图片容错兜底：图片加载失败自动展示彩色占位图
- ✅ 页面内锚点平滑滚动
- ✅ 本地存储：localStorage持久保存购物车数据

## 📁 项目目录结构
flower-shop
├── Public/                # 网站前端页面资源
│   ├── *.html            # 所有网页：首页、分类、购物车等
│   ├── css/              # 样式文件
│   ├── images/           # 图片素材
│   └── js/               # 页面内脚本
├── app.js                # 项目主入口脚本
├── shared-vue.js         # 公共 Vue 组件、全局工具函数
├── package.json
├── package-lock.json
├── .gitignore            # git 忽略配置（排除 node_modules）
├── README.md             # 项目说明文档
└── 课程设计书.docx       # 课程设计报告文档


## 🛠️ 技术栈
- HTML5：页面结构搭建
- CSS3：页面样式、响应式布局、动画效果
- JavaScript：原生JS交互、本地存储、页面功能
- Vue 2.6（CDN）：封装可复用组件，实现数据渲染

## 🚀 本地运行方式
1. 下载全部源码到本地
2. 直接打开 `Public/index.html` 即可访问网站，**无需安装依赖，不需要npm启动**

## 📌 部署说明
使用 GitHub Pages 进行静态网页部署，访问链接：
https://QccJ12123.github.io/flower-shop/Public/index.html

## 📄 课程设计文档
仓库附带课程设计书.docx，包含需求分析、系统设计、功能说明等完整课程设计报告。


