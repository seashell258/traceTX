import { useState } from "react";
import { strategies, symbols } from "../configs/StrategyAndSymbols";

interface Props {
  onChange: (mode: "strategy" | "symbol", strategyValue: string, symbolValue: string) => void;
}

export default function ModeSwitcher({ onChange }: Props) {
  const [mode, setMode] = useState<"strategy" | "symbol">("strategy");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const handleModeChange = (newMode: "strategy" | "symbol") => {
    setMode(newMode);
    setSelectedStrategy("");
    setSelectedSymbol("");
    onChange(newMode, "", "");
  };

  const handleStrategyChange = (newStrategy: string) => {
    setSelectedStrategy(newStrategy);
    setSelectedSymbol(""); // 重設標的選擇
    // 立即通知父元件，因為父元件可能需要根據策略值來更新 UI
    onChange(mode, newStrategy, "");
  };
  
  const handleSymbolChange = (newSymbol: string) => {
    setSelectedSymbol(newSymbol);
    onChange(mode, selectedStrategy, newSymbol);
  };
  
  // 根據目前所選的策略，找出其包含的標的列表
  const currentSymbols = strategies.find(s => s.name === selectedStrategy)?.symbols || [];

  return (
    <div className="flex gap-4 items-center">
      {/* 模式切換按鈕 */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${mode === "strategy" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleModeChange("strategy")}
        >
          策略模式
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === "symbol" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleModeChange("symbol")}
        >
        標的模式
        </button>
      </div>

      {/* 策略模式的下拉選單 */}
      {mode === "strategy" && (
        <>
          <select
            value={selectedStrategy}
            onChange={(e) => handleStrategyChange(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">請選擇策略</option>
            {strategies.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* 策略選單的子選單：標的選擇 */}
          {selectedStrategy && (
            <select
              value={selectedSymbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">請選擇標的</option>
              {currentSymbols.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      {/* 標的模式的下拉選單 */}
      {mode === "symbol" && (
        <select
          value={selectedSymbol}
          onChange={(e) => handleSymbolChange(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">請選擇標的</option>
          {symbols.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}