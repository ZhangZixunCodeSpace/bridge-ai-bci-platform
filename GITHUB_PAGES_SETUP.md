# GitHub Pages 设置说明

## 步骤 1: 推送代码到 GitHub

首先，将所有更改推送到您的 GitHub 仓库：

```bash
git add .
git commit -m "Setup GitHub Pages with BCI demo"
git push origin main
```

## 步骤 2: 启用 GitHub Pages

1. 访问您的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

## 步骤 3: 访问您的网站

设置完成后，您的网站将在以下地址可用：
```
https://your-username.github.io/bridge-ai-bci-platform
```

## 自动部署

现在每当您向 `main` 分支推送代码时，GitHub Actions 会自动部署您的网站。

## 演示文件

- `index.html` - 主页面，包含完整的 BCI 脑机接口演示
- 网站包含：
  - 实时脑电波形显示
  - 频谱分析图表
  - 交互式控制面板
  - 响应式设计，支持手机访问

## 注意事项

- 首次部署可能需要几分钟时间
- 确保您的仓库是公开的，或者您有 GitHub Pro 账户
- 任何对 `main` 分支的推送都会触发重新部署
