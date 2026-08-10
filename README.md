# 539 收藏分析 Pro Ultimate V4.1

## 功能
- Firebase Email/Password 登入
- Firestore 手機、電腦即時同步
- 開獎日期補登與開出順序保存
- 01～39 逐號三碼對照
- 下一期開出時自動圈選上一期命中候選
- 紙本表格模式
- 收藏規則追蹤、到期與達標判斷
- 規則管理、JSON 備份、CSV 匯出
- V3 localStorage 舊資料一鍵搬移到雲端

## GitHub Pages 更新
把 index.html、manifest.webmanifest、service-worker.js 上傳覆蓋原檔並 Commit。

## Firestore 安全規則（重要）
Firebase Console → Firestore → 規則，貼上 firestore.rules 的內容並發布。
規則只允許登入者讀寫自己的 users/{uid} 資料。

## 使用
第一次開啟可建立帳號。手機與電腦使用同一 Email/密碼登入即可同步。


## V4.1 更新
- 規則管理依「觸發號碼」由小到大排序。
- 新增或修改規則後，顯示順序不再受建立/更新時間影響。
- 多觸發規則以最小觸發號碼為主要排序依據。
