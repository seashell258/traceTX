import { useState } from "react";
import { strategies, symbols } from "../configs/StrategyAndSymbols";

interface Props {
  onChange: (mode: "strategy" | "symbol", value: string) => void;
}

export default function ModeSwitcher({ onChange }: Props) {
  const [mode, setMode] = useState<"strategy" | "symbol">("strategy");
  const [value, setValue] = useState("");

  const handleModeChange = (newMode: "strategy" | "symbol") => {
    setMode(newMode);
    setValue(""); // reset 選擇
    onChange(newMode, "");
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(mode, newValue);
  };

  return (
    <div className="flex gap-4 items-center">
      {/* 模式切換 */}
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

      {/* 子選單 (依 mode 顯示不同清單) */}
      {mode === "strategy" && (
        <select
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">請選擇策略</option>
          {strategies.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {mode === "symbol" && (
        <select
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
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
