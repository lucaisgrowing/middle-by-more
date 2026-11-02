# middle by more 0.4.0 测试记录

## 覆盖范围

Linux 上的真实 Chromium 扩展测试，本地合成三栏聊天页面。使用工具栏快捷键授予 activeTab，实际调用 chrome.tabs.captureVisibleTab，实际生成 PNG；不是静态 UI 预览。未在用户 Mac 或实际聊天网站实测。

- `node tests/unit.cjs`：位置排序、重叠、非零起点、重复补拍、空档和补齐；完整 UI 标签匹配、正文负例。
- `pnpm test:e2e`：手动等待、暂停锁定/继续、滚轮大步安全截停、暂停/继续提示、底部输入框裁切、固定跳转控件隐藏、普通流内消息数与 See more 控件隐藏、动态新增控件检测、拍完恢复样式、正文不被分类器误判、取消自动清理后控件在真实截图中保留、PNG 下载、两侧首屏、清理本机任务。
- 16 屏拼接，中心 735 × 7062 px。逐像素检查：输入框、固定跳转和流内消息控件的三种纯色哨兵均为 0。自动底部避让 88 px。

机器可读结果：`tests/test-report.json`。图片全部来自本地生成测试页面，不含用户提供的聊天截图。

## 复现

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
# Linux 图形测试还需 xvfb 与 xdotool；例如 apt install xvfb xdotool
xvfb-run -a pnpm test:e2e
```

有桌面图形环境时可直接运行 `pnpm test:e2e`。测试需要 xdotool 和 Chromium 扩展支持；不能用普通无扩展的无头页面替代实际 captureVisibleTab 测试。

## 限制

过滤是本机 DOM 启发式规则，不是 AI/OCR；不改变图片里的文字，不保证所有网站或跨域 iframe/封闭组件能识别。只临时隐藏小型交互控件，不展开消息或删除正文；不压缩布局。虚拟列表、动态历史加载导致内容重排、持续新增消息等仍可能影响按滚动位置的拼接。
