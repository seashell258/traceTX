dashboard 可以有按鈕切換不同圖表

策略 based 就是能進一步選它買的所有標的 (但一次指出一張 k 線圖，避免效能爆炸)
標的 based 就是把所有策略在它身上買的部位疊圖上去

我現在有一個 react 的app 他有一個按鈕區 能夠選擇 strategy based的畫圖 然後選之後 他會要求選擇 strategyA或B 再選擇那個策略有買的所有標的裡面的哪一個 (畫圖只能一次畫出一個標的)
 
他會用 lightweight 去畫出假資料的k線圖 然後用marker在上面疊圖假資料的交易紀錄。   

如果選 symbol based  他會要求選擇哪一個 symbol。 接著會畫出symbol的k線圖 並且畫出所有有買這symbol的策略的marker

# 交易紀錄資料管理
1.交易紀錄進 sqllite 本地，這樣能最快紀錄到這些資訊。 (因為postgreSQL在server 還要連線，除非交易紀錄非常多筆，不然sqlite應該是比較快。)
2.然後 postgre sql 定期去拉 sqlite。
3.最後畫表的時候，從 porstgre 定期拿。 在前端先進行資料處理，只把新的交易紀錄 marker 擴充進 marker 列表 ( locally changed，不用複製新變數出來 )
4.然後再 setmarker 傳進圖表上。 ( setMarker 還是得全圖marker重新繪製，這是套件本身的限制。)

# k線資料管理
歷史資料有拉過的，就本地儲存進 sqlite。 每日更新全標的
但如果有操作 app 想畫圖表。 就去即時再更新資料。 用 alpha vantage 可以免費的抓到盡量即時的資料。 (  其他的大概都要延遲15分鐘 )

單表，多標的
CREATE TABLE kline (
    ticker TEXT,
    time TIMESTAMP,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume REAL,
    PRIMARY KEY(ticker, time)
)


優點：只維護一個表格，程式統一處理；方便做跨標的統計
缺點：資料量大時單表查詢稍慢（可透過索引優化）

單表多標的，搭配 ticker + time 作 PRIMARY KEY，程式統一操作，方便抓最新資料和增量更新。