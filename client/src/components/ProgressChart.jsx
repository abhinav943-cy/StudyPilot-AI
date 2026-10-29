
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="panel p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-white">Weekly activity</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tasks completed each day
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#263044" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: 12,
                color: "#fff",
              }}
            />
            <Bar dataKey="completed" name="Completed tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
