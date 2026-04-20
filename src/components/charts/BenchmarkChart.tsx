import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BenchmarkDatum = Record<string, number | string> & {
  qubits: number;
};

type Props = {
  title: string;
  description: string;
  hardwareNote: string;
  xAxisLabel: string;
  yAxisLabel: string;
  data: BenchmarkDatum[];
  keys: string[];
};

const FRAMEWORK_COLORS: Record<string, string> = {
  Cirq: "#4CAF50",
  MindQuantum: "#E53935",
  "MQ-mqchem": "#EC407A",
  PennyLane: "#FB8C00",
  Qiskit: "#1E88E5",
  Quilts: "#8E24AA",
  TFQ: "#546E7A",
};

function resolveColor(key: string, index: number) {
  if (FRAMEWORK_COLORS[key]) return FRAMEWORK_COLORS[key];
  const fallback = [
    "#1E88E5",
    "#43A047",
    "#FB8C00",
    "#E53935",
    "#8E24AA",
    "#00897B",
    "#C62828",
    "#3949AB",
  ];
  return fallback[index % fallback.length];
}

export default function BenchmarkChart({
  title,
  description,
  hardwareNote,
  xAxisLabel,
  yAxisLabel,
  data,
  keys,
}: Props) {
  return (
    <figure className="mq-card bg-card p-6 md:p-8">
      <figcaption className="text-lg md:text-xl font-bold text-foreground text-center mb-6">
        {title}
      </figcaption>
      <div className="w-full" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 40 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="qubits"
              stroke="hsl(var(--muted-foreground))"
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -24,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              stroke="hsl(var(--muted-foreground))"
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--popover-foreground))",
                fontSize: 12,
              }}
              labelFormatter={(v) => `${xAxisLabel}: ${v}`}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 24 }}
              iconType="circle"
            />
            {keys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={resolveColor(key, i)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-4">{hardwareNote}</p>
      <p className="mt-4 rounded-lg bg-brand-blue-light text-foreground px-4 py-3 text-sm">
        {description}
      </p>
    </figure>
  );
}
