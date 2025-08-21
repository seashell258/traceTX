import { useState } from "react";
import ModeSwitcher from "./components/ModeSwitcher";
import ChartDisplay from "./components/ChartDisplay";

export default function Dashboard() {
  const [mode, setMode] = useState<"strategy" | "symbol">("strategy");
  const [strategyValue, setStrategyValue] = useState("");
  const [symbolValue, setSymbolValue] = useState("");

  const handleModeChange = (newMode: "strategy" | "symbol", newStrategyValue: string, newSymbolValue: string) => {
    setMode(newMode);
    setStrategyValue(newStrategyValue);
    setSymbolValue(newSymbolValue);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ModeSwitcher now passes three values to onChange */}
      <ModeSwitcher onChange={handleModeChange} />

      {/* ChartDisplay needs to receive all three values to determine what to render */}
      <ChartDisplay 
        mode={mode} 
        strategyValue={strategyValue} 
        symbolValue={symbolValue} 
      />
    </div>
  );
}