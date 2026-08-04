# 539 收藏分析 Pro V3.3

## GitHub Pages 更新方式
1. 將此資料夾內的 `index.html`、`manifest.webmanifest`、`service-worker.js` 上傳到原本 Repository 根目錄。
2. GitHub 出現同名檔案時選擇覆蓋，最下方按 **Commit changes**。
3. 等待約 1–3 分鐘後重新整理原網站。

## 新增功能
- 總覽儀表板
- 規則命中率排行榜
- 號碼歷史出現次數
- 今日重點號加權排序
- 分享圖 PNG 產生器
- 自訂規則與追蹤
- JSON 備份、CSV 匯出、PWA 離線功能

資料儲存在瀏覽器 localStorage，更新網站程式通常不會刪除資料，但換手機或清除瀏覽器前務必先匯出 JSON。


## V3.3 修正
- 規則只會比對觸發日之後的開獎資料。
- 補登較早日期時，不會倒算成已命中。
- 開啟新版後會依歷史日期自動重算追蹤狀態。
