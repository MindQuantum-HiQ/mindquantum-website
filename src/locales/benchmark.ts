import type { Lang } from "../config/i18n";

export type BenchmarkChart = {
  title: string;
  description: string;
  hardwareNote: string;
};

export type BenchmarkMessages = {
  metaDescription: string;
  title: string;
  subtitle: string;
  legendLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
  charts: {
    randomCircuit: BenchmarkChart;
    qaoa: BenchmarkChart;
    vqe: BenchmarkChart;
  };
};

export const BENCHMARK_MESSAGES: Record<Lang, BenchmarkMessages> = {
  en: {
    metaDescription:
      "Performance benchmarks comparing MindQuantum with other quantum computing frameworks.",
    title: "Benchmark",
    subtitle:
      "We benchmarked the performance of MindQuantum against some alternative quantum computing frameworks",
    legendLabel: "Framework",
    xAxisLabel: "Number of qubits",
    yAxisLabel: "Time (s)",
    charts: {
      randomCircuit: {
        title: "Random Circuit Evolution Simulation",
        description:
          "For small numbers of qubits, MindSpore Quantum's advantage comes primarily from its lower API call overhead. For larger numbers of qubits, its multi-threaded parallel computing and efficient common quantum gate evolutions ensure superior performance.",
        hardwareNote:
          "Test hardware: 8U32G · Accuracy: Qiskit, TenCirChem, MindSpore Quantum FP64; TFQ FP32",
      },
      qaoa: {
        title: "QAOA Solving the Max-Cut Problem",
        description:
          "MindSpore Quantum's performance is at least an order of magnitude faster than other frameworks, thanks to deep optimization when computing parameterized circuit gradients and efficient circuit evolution.",
        hardwareNote:
          "Test hardware: 8U32G · Accuracy: Qiskit, TenCirChem, MindSpore Quantum FP64; TFQ FP32",
      },
      vqe: {
        title: "VQE Solving the Ground-State Energy of Chemical Molecules",
        description:
          "MindSpore Quantum's performance is at least an order of magnitude faster than other frameworks, thanks to deep optimization when computing parameterized circuit gradients and efficient circuit evolution.",
        hardwareNote:
          "Test hardware: 8U32G · Accuracy: Qiskit, TenCirChem, MindSpore Quantum FP64; TFQ FP32",
      },
    },
  },
  zh: {
    metaDescription:
      "MindQuantum 与其他量子计算框架的性能基准对比。",
    title: "性能基准",
    subtitle: "我们将 MindQuantum 与其它常见的量子计算框架进行了性能基准对比",
    legendLabel: "框架",
    xAxisLabel: "量子比特数",
    yAxisLabel: "耗时 (秒)",
    charts: {
      randomCircuit: {
        title: "随机电路演化模拟",
        description:
          "小规模量子比特时，MindSpore Quantum 的优势主要来自更低的 API 调用开销；大规模量子比特时，其多线程并行计算与高效的常见量子门演化实现确保了优异的性能。",
        hardwareNote:
          "测试硬件：8U32G · 计算精度：Qiskit / TenCirChem / MindSpore Quantum FP64；TFQ FP32",
      },
      qaoa: {
        title: "QAOA 求解最大割问题",
        description:
          "得益于参数化量子电路梯度计算上的深度优化与高效的电路演化实现，MindSpore Quantum 的性能至少比其他框架快一个数量级。",
        hardwareNote:
          "测试硬件：8U32G · 计算精度：Qiskit / TenCirChem / MindSpore Quantum FP64；TFQ FP32",
      },
      vqe: {
        title: "VQE 求解化学分子基态能量",
        description:
          "得益于参数化量子电路梯度计算上的深度优化与高效的电路演化实现，MindSpore Quantum 的性能至少比其他框架快一个数量级。",
        hardwareNote:
          "测试硬件：8U32G · 计算精度：Qiskit / TenCirChem / MindSpore Quantum FP64；TFQ FP32",
      },
    },
  },
};
