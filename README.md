539 收藏分析 Pro Ultimate V6.27.11

本版重點：
- 修正「下期共振100」手機正常、電腦仍顯示空白的舊 Service Worker / HTML 快取問題。
- 新增 service-worker.js V6.27.11，導覽頁採 network-first 並清除舊版快取。
- Service Worker 註冊改為 updateViaCache:none，載入時主動檢查更新。
- 保留 V6.27.10 的「各來源號碼統計 / 100次事件明細」render 修正。
- 保留斷0/1/2/3頭複選、全部取消與四色標記。

下期共振100定義：每個最新來源號碼往歷史找最近最多100次「該號碼實際出現」事件，再統計其立即下一期；屬歷史統計，不代表未來中獎率。
