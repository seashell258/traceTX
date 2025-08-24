import { strategies } from "../configs/StrategyAndSymbols";
import { allMarkersByStrategy, allMarkersBySymbol } from "./tx-log";
import { createSeriesMarkers, createChart, CandlestickSeries } from "lightweight-charts";
import type { SeriesMarker, UTCTimestamp, CandlestickData } from 'lightweight-charts';
import { useEffect, useRef } from "react";


interface Props {
  mode: "strategy" | "symbol";
  strategyValue: string;
  symbolValue: string
}



export default function ChartDisplay({ mode, strategyValue, symbolValue }: Props) {
  const chartContainer = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!chartContainer.current) return;

    const chart = createChart(chartContainer.current!, {
      width: 900, height: 600, timeScale: {
        timeVisible: true
      }
    });

    // 用 Map 存每個 ticker 的 series
    const seriesMap = new Map<string, ReturnType<typeof chart.addSeries>>();

    // 動態抓資料並建立 series
    const fetchData = async (ticker: string) => {
      // 如果這個 ticker 還沒 series，先新增
      if (!seriesMap.has(ticker)) {
        const newSeries = chart.addSeries(CandlestickSeries, { title: ticker });
        seriesMap.set(ticker, newSeries);
      }

      const res = await fetch(`/api/kline?ticker=${ticker}`);
      const data = await res.json();

      seriesMap.forEach((s, key) => {
        s.applyOptions({ visible: key === ticker });
      });

      seriesMap.get(ticker)!.setData(data);
    };

    // 範例：動態切換 ticker
    fetchData(symbolValue);

    /*
        //#region draw corresponding marker 
        console.log('strategy:', strategyValue, 'symbol:', symbolValue)
        // Retrieve the markers directly in a single line
        const chartMarkers = allMarkersByStrategy.get(strategyValue)?.get(symbolValue) || [];
        // Now `chartMarkers` is either an array of the correct markers or an empty array
        console.log(chartMarkers);
    */

    let chartMarkers: SeriesMarker<UTCTimestamp>[] = [];

    if (mode === "strategy") {
      chartMarkers = allMarkersByStrategy.get(strategyValue)?.get(symbolValue) || [];

    } else if (mode === "symbol") {
      const strategyMap = allMarkersBySymbol.get(symbolValue);
      chartMarkers = strategyMap ? Array.from(strategyMap.values()).flat() : [];

    }
    console.log(chartMarkers)
    //原本填的是klineseries
    createSeriesMarkers(seriesMap.get(symbolValue)!, chartMarkers);
    //endregion

    //#region update kline realtime with websocket
    if (!wsRef.current) {
      wsRef.current = new WebSocket('ws://localhost:3000');
      wsRef.current.onopen = () => console.log('Connected');
      wsRef.current.onmessage = (msg) => {
        const { type, data } = JSON.parse(msg.data);
        if (type === "candle") {
          seriesMap.get('AAON')!.update(data); // lightweight-charts 的 API
        }
      }
    }

    //endregion
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      chart.remove()
    }; // 清理圖表，避免重複 render
  }, [mode, strategyValue, symbolValue]); // mode 或 value 改變就重新畫圖

  return <div ref={chartContainer} />;
}
