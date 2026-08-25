# Supersource Portfolio

庄达源（Supersource）的个人作品集网站，使用原生 HTML、CSS、JavaScript 和 Three.js 构建，通过 GitHub Pages 发布。

- 在线地址：<https://supersource6666.github.io/>
- 发布分支：`main`
- 发布目录：仓库根目录 `/(root)`

## 项目结构

```text
Supersource6666.github.io/
├── index.html                         # 页面内容与结构
├── .nojekyll                          # 跳过 Jekyll 构建
├── assets/
│   ├── style.css                      # 页面样式与响应式布局
│   ├── vehicle.js                     # Three.js 场景、GLB 加载与交互
│   ├── one_inch.jpg                   # 页面使用的个人照片
│   ├── og.png                         # 社交分享预览图
│   └── vendor/                        # 本地保存的 Three.js 运行文件
└── index_files/
    └── train.glb                      # 首页展示的列车三维模型
```

## 修改网站内容

### 修改文字、栏目和链接

编辑根目录的 `index.html`。当前栏目顺序为：

1. 关于
2. 论文
3. 项目
4. 教育

论文信息确认后，可在 `id="papers"` 的区块中替换“论文成果待更新”内容。

### 替换个人照片

使用新的 JPG 或 PNG 图片覆盖：

```text
assets/one_inch.jpg
```

如果文件名或扩展名发生变化，需要同时修改 `index.html` 中 `.portrait-frame img` 的 `src`。

### 替换三维模型

使用新的二进制 glTF 模型覆盖：

```text
index_files/train.glb
```

保持文件名不变时无需修改代码。`assets/vehicle.js` 会自动计算模型边界、居中并缩放模型。

如果使用其他文件名，需要同步修改 `assets/vehicle.js` 中的模型路径：

```js
loader.load("./index_files/train.glb", ...);
```

建议使用自包含纹理的 `.glb` 文件，避免遗漏外部纹理资源。

### 修改 Three.js 展示效果

编辑 `assets/vehicle.js`，可以调整：

- 摄像机位置与视角
- 灯光亮度和颜色
- 工程网格尺寸
- 模型默认朝向和缩放比例
- 自动旋转速度
- 鼠标、触控和键盘交互

Three.js 及 GLTFLoader 已保存在 `assets/vendor/`，网站不依赖第三方 CDN。

## 本地预览

在 PowerShell 中进入仓库目录：

```powershell
cd C:\Users\32162\personal_main_home\Supersource6666.github.io
```

启动静态服务器：

```powershell
py -m http.server 8765 --bind 127.0.0.1
```

如果系统使用 `python` 命令：

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

浏览器访问：

```text
http://127.0.0.1:8765/
```

不要直接双击打开 `index.html`。Three.js 模块和 GLB 模型需要通过 HTTP 服务加载。

## 提交并部署到 GitHub Pages

### 1. 同步远端代码

```powershell
git switch main
git pull --ff-only origin main
```

### 2. 检查修改

```powershell
git status
git diff --check
```

确认没有误加入手机号、私密文件、密钥或无关大文件。

### 3. 提交修改

```powershell
git add index.html .nojekyll assets index_files/train.glb README.md
git commit -m "Update portfolio"
```

### 4. 推送到 GitHub

```powershell
git push origin main
```

推送 `main` 后，GitHub Pages 会自动开始部署。

### 5. 检查部署

1. 打开 GitHub 仓库。
2. 进入 **Actions**，等待 `pages build and deployment` 变为绿色。
3. 访问 <https://supersource6666.github.io/>。
4. 强制刷新页面，确认文字、照片和列车模型均为最新版本。

发布通常需要几分钟。如果页面仍是旧版本，可在网址后临时添加查询参数绕过缓存：

```text
https://supersource6666.github.io/?v=本次提交号
```

## GitHub Pages 配置

在仓库的 **Settings → Pages → Build and deployment** 中确认：

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

## 常见问题

### 本地页面无法访问

- 确认静态服务器仍在运行。
- 确认访问端口是 `8765`，而不是旧端口 `8000`。
- 检查端口是否被其他程序占用。

### 页面正常但模型不显示

- 确认 `index_files/train.glb` 存在。
- 确认 `assets/vendor/` 下的 Three.js 和 GLTFLoader 文件没有遗漏。
- 使用浏览器开发者工具检查 Console 和 Network。
- 不要通过 `file:///` 地址打开网页。

### GitHub Pages 没有更新

- 检查提交是否已经推送到 `origin/main`。
- 检查 GitHub Actions 中的 Pages 部署结果。
- 等待几分钟后强制刷新或添加提交号查询参数。

## 当前版本

当前首页包含白蓝色现代技术作品集、个人照片、公开 GitHub 项目、教育经历，以及使用 `train.glb` 的 Three.js 交互式列车模型。
