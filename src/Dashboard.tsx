import { useState } from "react";
import ModeSwitcher from "./components/ModeSwitcher";
import ChartDisplay from "./components/ChartDisplay";

export default function Dashboard() {
  const [mode, setMode] = useState<"strategy" | "symbol">("strategy");
  const [selected, setSelected] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ModeSwitcher 控制 Dashboard 狀態 */}
      <ModeSwitcher
        onChange={(mode, value) => {
          setMode(mode);
          setSelected(value);
        }}
      />

      {/* ChartDisplay 根據 Dashboard 狀態渲染 */}
      <ChartDisplay mode={mode} value={selected} />
    </div>
  );
}
