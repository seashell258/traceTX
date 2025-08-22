dashboard 可以有按鈕切換不同圖表

策略 based 就是能進一步選它買的所有標的 (但一次指出一張 k 線圖，避免效能爆炸)
標的 based 就是把所有策略在它身上買的部位疊圖上去

我現在有一個 react 的app 他有一個按鈕區 能夠選擇 strategy based的畫圖 然後選之後 他會要求選擇 strategyA或B 再選擇那個策略有買的所有標的裡面的哪一個 (畫圖只能一次畫出一個標的)
 
他會用 lightweight 去畫出假資料的k線圖 然後用marker在上面疊圖假資料的交易紀錄。   

如果選 symbol based  他會要求選擇哪一個 symbol。 接著會畫出symbol的k線圖 並且畫出所有有買這symbol的策略的marker