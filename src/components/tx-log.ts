import type {UTCTimestamp,SeriesMarker} from 'lightweight-charts'

type CustomMarker = SeriesMarker<UTCTimestamp> & {
  strategyId: string;
  symbol: string;
};

type MarkerData = Map<string, Map<string, CustomMarker[]>>;

function toUTCTimestamp(t: number): UTCTimestamp {
  return t as UTCTimestamp;
}


// 假設你已經定義了 allMarkersByStrategy 和 allMarkersBySymbol
const allMarkersByStrategy:MarkerData = new Map();
const allMarkersBySymbol:MarkerData = new Map();

const addMarker = (marker: CustomMarker) => {
  const { strategyId, symbol } = marker;
  //新增資料進入 strategy based 的 marker
  if (!allMarkersByStrategy.has(strategyId)) {
    allMarkersByStrategy.set(strategyId, new Map());
  }
  if (!allMarkersByStrategy.get(strategyId)!.has(symbol)) {
    allMarkersByStrategy.get(strategyId)!.set(symbol, []);
  }
  allMarkersByStrategy.get(strategyId)!.get(symbol)!.push(marker);
// 同一筆資料新增進入 symbol based 的 marker
  if (!allMarkersBySymbol.has(symbol)) {
    allMarkersBySymbol.set(symbol, new Map());
  }
  if (!allMarkersBySymbol.get(symbol)!.has(strategyId)) {
    allMarkersBySymbol.get(symbol)!.set(strategyId, []);
  }
  allMarkersBySymbol.get(symbol)!.get(strategyId)!.push(marker);
};


const FakeMarkers:CustomMarker[] = [
  {
    color: 'green',
    position: 'aboveBar',
    shape: 'arrowDown',
    time: toUTCTimestamp(1755610993),
    price: 153,
    text: 'Buy 77 shares (Strategy A)',
    strategyId: 'strategyA',
    symbol: 'aapl',
  },
  {
    color: 'purple',
    position: 'aboveBar',
    shape: 'arrowDown',
    time: toUTCTimestamp(1755611113),
    price: 155,
    text: 'Buy 68 shares (Strategy A)',
    strategyId: 'strategyA',
    symbol: 'aapl',
  },
  {
    color: 'blue',
    position: 'aboveBar',
    shape: 'arrowDown',
    time: toUTCTimestamp(1755610993),
    price: 160,
    text: 'Sell 55 shares (Strategy B)',
    strategyId: 'strategyB',
    symbol: 'aapl',
  },
  {
    color: 'orange',
    position: 'aboveBar',
    shape: 'arrowDown',
    time: toUTCTimestamp(1755610993),
    price: 250,
    text: 'Sell 44 shares (Strategy B)',
    strategyId: 'strategyB',
    symbol: 'goog',
  },
];


for (const marker of FakeMarkers) {
  addMarker(marker);
}

export {allMarkersByStrategy,allMarkersBySymbol}
/*

1.策略模式
2.先選策略 strategyB
3.再選標的 aapl
然後這策略有買標的的都filter出來 
用 策略 filter 到 StrategyB 然後再 filter到標的的 aapl

'strategyB' => Map {
    'aapl' => [
      {

但如果是標的模式
我現在的marker map。 外層是　strategy 這樣我很不容易去取得策略裡面的 aapl 然後全部聚合再一起 
'strategyB' => Map {
    'aapl' => [
      {

策略模式
先選策略 
再選標的

目前的想法是，可能對於一筆交易紀錄，得要維護兩種 marker。 之後要再新增 symbol based 的 markers

資料大概長下面這樣 (strategy based)
 */

/* allMarkers = Map {
  'strategyA' => Map {
    'aapl' => [
      {
        color: 'green',
        position: 'belowBar',
        shape: 'arrowUp',
        time: '2025-08-19',
        price: 153,
        text: 'AAPL Buy (Strategy A)',
        strategyId: 'strategyA',
        symbol: 'aapl',
      },
      {
        color: 'purple',
        position: 'belowBar',
        shape: 'arrowUp',
        time: '2025-08-21',
        price: 155,
        text: 'AAPL Buy (Strategy A)',
        strategyId: 'strategyA',
        symbol: 'aapl',
      },
    ]
  },
  'strategyB' => Map {
    'aapl' => [
      {
        color: 'blue',
        position: 'aboveBar',
        shape: 'arrowDown',
        time: '2025-08-20',
        price: 160,
        text: 'AAPL Sell (Strategy B)',
        strategyId: 'strategyB',
        symbol: 'aapl',
      },
    ],
    'goog' => [
      {
        color: 'orange',
        position: 'aboveBar',
        shape: 'arrowDown',
        time: '2025-08-22',
        price: 250,
        text: 'GOOG Sell (Strategy B)',
        strategyId: 'strategyB',
        symbol: 'goog',
      },
    ],
  },
}; */