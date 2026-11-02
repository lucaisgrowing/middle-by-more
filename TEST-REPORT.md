# middleshoooot by more 0.5.0 测试记录

## 覆盖范围

Linux 上的真实 Chromium 扩展页面与本地合成测试素材。采集测试实际调用 `chrome.tabs.captureVisibleTab`；编辑测试在已加载的扩展结果页真实点击、拖拽与下载 PNG。不是静态 UI 预览。未在用户 Mac 或实际聊天网站实测。

- `node tests/unit.cjs`：位置排序、重叠、非零起点、重复补拍、空档和补齐；完整 UI 标签匹配、正文负例。
- `pnpm test:e2e`：手动等待、暂停锁定/继续、滚轮大步安全截停、输入框裁切、固定和流内控件隐藏、动态新增控件检测、拍后恢复、正文负例、关闭自动清理、PNG 下载、两侧首屏、清除本机任务。16 屏拼接，中心 735 × 7062 px；输入框、固定跳转和流内控件的三种哨兵像素均为 0。
- `pnpm test:editor`：方框、箭头、画笔、文字、实心遮挡；撤销/重做及历史分支；50% 显示比例的坐标映射；保留标注的裁剪与撤销/重做；真实下载扁平 PNG；边栏切换的确认/取消；分段独立编辑与历史；还原后撤销；清除原始数据；无页面脚本错误。导出的测试图片为 800 × 530 px，遮挡像素验证为不透明黑色。
- JS 语法检查与 `git diff --check`。

机器可读结果：`tests/test-report.json` 与 `tests/editor-test-report.json`。图片均为本地合成素材，不含用户提供的聊天截图。`tests/editor-preview.png` 为实际扩展编辑页截图，`tests/editor-output.png` 为实际下载的编辑结果。

## 复现

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
# Linux 图形测试需要 xvfb、xdotool
xvfb-run -a pnpm test:e2e
xvfb-run -a pnpm test:editor
```

有桌面图形环境时可不使用 xvfb。不能用普通无扩展的无头页面替代实际 captureVisibleTab 测试。

## 限制

编辑仅保留在当前结果页内存中，刷新/关闭前应下载；原始采集仍在本机扩展存储中，须另行清除。PNG 为扁平像素，不包含可恢复的标注层；实心遮挡须完全覆盖敏感区域。当前无移动已有标注、旋转、滤镜或 OCR。大画布/多步裁剪会消耗内存，长截图建议分段。

界面清理为本机 DOM 启发式规则，不是 AI/OCR；不处理图片内部文字，不保证所有网站或跨域 iframe/封闭组件能识别。虚拟列表、历史加载重排、持续新增消息仍可能影响拼接。
