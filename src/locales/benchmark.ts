import type { Lang } from "../config/i18n";

export type BenchmarkSpec = {
  label: string;
  value: string;
};

export type BenchmarkMethodologyBlock = {
  label: string;
  value: string;
  detail?: string;
};

export type BenchmarkFramework = {
  name: string;
  version: string;
  /** Mark the framework under test so it gets typographic weight in the list. */
  highlight?: boolean;
};

export type BenchmarkSection = {
  kicker: string;
  heading: string;
  lead: string;
  cpuCaption: string;
  gpuCaption: string;
  cpuFigLabel: string;
  gpuFigLabel: string;
  cpuAlt: string;
  gpuAlt: string;
  finding: string;
  findingSource: string;
  /** Optional href for the finding attribution. When set the source label
      renders as a link (used to point at the source paper on arXiv). */
  findingHref?: string;
};

export type BenchmarkMessages = {
  metaDescription: string;
  kicker: string;
  title: string;
  subtitle: string;
  summary: BenchmarkSpec[];
  methodology: {
    heading: string;
    blocks: BenchmarkMethodologyBlock[];
  };
  frameworks: {
    heading: string;
    lead: string;
    versionLabel: string;
    items: BenchmarkFramework[];
  };
  reader: {
    original: string;
    enlarge: string;
    close: string;
    zoom: string;
    fit: string;
    openOriginal: string;
    pan: string;
    axes: string;
    precision: string;
    cpuHardware: string;
    gpuHardware: string;
  };
  randomCircuit: BenchmarkSection;
  qaoa: BenchmarkSection;
  cta: {
    heading: string;
    lead: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

const FRAMEWORKS: BenchmarkFramework[] = [
  { name: "MindQuantum", version: "0.9.0", highlight: true },
  { name: "Qiskit", version: "0.45.0" },
  { name: "ProjectQ", version: "0.8.0" },
  { name: "PennyLane", version: "0.33.0" },
  { name: "PyQpanda", version: "3.8.0" },
  { name: "Qulacs", version: "0.6.2" },
  { name: "TensorFlow Quantum", version: "0.7.2" },
  { name: "Intel-QS", version: "2.0.0-beta" },
  { name: "cuQuantum", version: "23.10.0" },
];

const PAPER_HREF = "https://arxiv.org/abs/2406.17248";
const BENCHMARK_CODE_HREF =
  "https://atomgit.com/mindspore/mindquantum/tree/research/whitepaper/code/benchmark";

export const BENCHMARK_MESSAGES: Record<Lang, BenchmarkMessages> = {
  en: {
    metaDescription:
      "Measured performance of MindQuantum against eight other quantum computing frameworks on random circuit simulation and end-to-end QAOA, on CPU and a single NVIDIA V100 GPU.",
    kicker: "Performance benchmark · v0.9.0",
    title: "MindQuantum against eight other quantum frameworks.",
    subtitle:
      "Published results for random circuit simulation and end-to-end QAOA on CPU and a single NVIDIA V100. Compare the original figures from the MindSpore Quantum white paper, with hardware and precision noted below.",
    summary: [
      { label: "Frameworks tested", value: "9" },
      { label: "Workloads", value: "2" },
      { label: "Qubit range", value: "4 to 27" },
      { label: "Backends", value: "CPU and GPU" },
    ],
    methodology: {
      heading: "Method",
      blocks: [
        {
          label: "Hardware",
          value: "Intel Xeon E5-2620 v3 @ 2.40 GHz",
          detail: "16 threads, SIMD enabled. NVIDIA V100 for the GPU runs.",
        },
        {
          label: "Test harness",
          value: "pytest-benchmark",
          detail:
            "End-to-end wall-clock time over repeated iterations, as reported in the white paper.",
        },
        {
          label: "Numerical precision",
          value: "FP64 and FP32",
          detail:
            "MindQuantum is shown at both precisions. TensorFlow Quantum is single precision (FP32); compare like-for-like where available.",
        },
      ],
    },
    frameworks: {
      heading: "Nine frameworks, one rig.",
      lead: "Versions used in the published benchmark, not current releases. CPU runs use the same thread configuration and circuit definitions.",
      versionLabel: "Version",
      items: FRAMEWORKS,
    },
    reader: {
      original: "Original figure · MindSpore Quantum white paper",
      enlarge: "Enlarge figure",
      close: "Close",
      zoom: "Zoom in",
      fit: "Fit width",
      openOriginal: "Open original PNG",
      pan: "When zoomed, scroll or swipe to inspect the figure. Keyboard: focus the figure and use the arrow keys.",
      axes: "Reading the figures: time in seconds, logarithmic scale. Lower is faster; each major step is ×10.",
      precision: "MindQuantum: solid red = FP64; dashed red = FP32. Original legends and all comparison curves are preserved.",
      cpuHardware: "CPU · 16 threads, SIMD",
      gpuHardware: "GPU · NVIDIA V100",
    },
    randomCircuit: {
      kicker: "01 / Raw simulation speed",
      heading: "Random circuit evolution, 4 to 27 qubits.",
      lead: "Each framework simulates the same random circuit built from X, Y, Z, H, CNOT, S, T, RX, RY, RZ, Rxx, Ryy, Rzz, SWAP, and their controlled variants. Qubit count scales from 4 to 27, timed with pytest-benchmark.",
      cpuFigLabel: "Fig. 1a — CPU backend",
      gpuFigLabel: "Fig. 1b — GPU backend",
      cpuAlt:
        "Log-scale line chart comparing CPU simulation time of a random circuit for MindQuantum (FP64 and FP32), Qulacs, PyQpanda, ProjectQ, PennyLane, Intel-QS, and TensorFlow Quantum, from 4 to 27 qubits.",
      gpuAlt:
        "Log-scale line chart comparing GPU simulation time of a random circuit for MindQuantum (FP64 and FP32), Qulacs, PennyLane, and TensorFlow Quantum, from 4 to 27 qubits on a single NVIDIA V100.",
      cpuCaption:
        "MindQuantum and Qulacs lead at every qubit count. The dip at 13 qubits is the threshold where MindQuantum switches on OpenMP multi-threading; below it the single-threaded path is faster.",
      gpuCaption:
        "On a single V100, MindQuantum keeps its lead through 27 qubits. TensorFlow Quantum scales more aggressively at the high end, but the comparison is single precision against double.",
      finding:
        "MindQuantum and Qulacs have been optimized to near the limit of the low-level implementation.",
      findingSource: "MindSpore Quantum white paper · arXiv:2406.17248",
      findingHref: PAPER_HREF,
    },
    qaoa: {
      kicker: "02 / End-to-end optimization",
      heading: "QAOA solving max-cut on 4-regular graphs.",
      lead: "End-to-end timing of a real variational workload: build the QAOA ansatz from a one-step Trotter decomposition, then drive it through scipy.optimize.minimize with BFGS until convergence. Problem size ranges from 5 to 23 nodes. Each framework runs until its own time budget is exhausted, which is why the curves end at different qubit counts.",
      cpuFigLabel: "Fig. 2a — CPU backend",
      gpuFigLabel: "Fig. 2b — GPU backend",
      cpuAlt:
        "Log-scale line chart comparing CPU end-to-end QAOA time for MindQuantum (FP64 and FP32), Qulacs, TensorCircuit (FP64 and FP32), TensorFlow Quantum, PennyLane, and PyQpanda, from 5 to 23 qubits.",
      gpuAlt:
        "Log-scale line chart comparing GPU end-to-end QAOA time for MindQuantum (FP64 and FP32), TensorFlow Quantum, and PennyLane, from 5 to 23 qubits on a single NVIDIA V100.",
      cpuCaption:
        "MindQuantum stays at least an order of magnitude ahead through the entire qubit range. Frameworks without an efficient adjoint method fall behind early.",
      gpuCaption:
        "On the V100, the gap widens further. PennyLane drops out at 14 qubits, TensorFlow Quantum at 19; MindQuantum reaches 23.",
      finding:
        "MindQuantum is at least one order of magnitude faster than other frameworks, mainly due to its optimized adjoint method for gradient computation and efficient circuit evolution.",
      findingSource: "MindSpore Quantum white paper · arXiv:2406.17248",
      findingHref: PAPER_HREF,
    },
    cta: {
      heading: "Reproduce these benchmarks.",
      lead: "Every framework, circuit, and harness used here is open source. The text and figures on this page are drawn from the MindSpore Quantum white paper; the runner scripts live next to the paper in the public repository.",
      primary: { label: "Read the paper · arXiv:2406.17248", href: PAPER_HREF },
      secondary: { label: "Run the benchmark code", href: BENCHMARK_CODE_HREF },
    },
  },
  zh: {
    metaDescription:
      "在同一硬件上对 MindQuantum 与其他八个量子计算框架进行性能对比，覆盖随机电路模拟与端到端 QAOA，包含 CPU 与单卡 NVIDIA V100 GPU 两种后端。",
    kicker: "性能基准 · v0.9.0",
    title: "MindQuantum 与八个量子框架同台对比。",
    subtitle:
      "来自 MindSpore Quantum 技术报告的已发表结果，覆盖随机电路模拟与端到端 QAOA，包含 CPU 与单卡 NVIDIA V100 两种后端。下方保留论文原图，并列明硬件与精度条件。",
    summary: [
      { label: "参测框架", value: "9 个" },
      { label: "测试任务", value: "2 项" },
      { label: "比特规模", value: "4 至 27" },
      { label: "运行后端", value: "CPU 与 GPU" },
    ],
    methodology: {
      heading: "测试方法",
      blocks: [
        {
          label: "硬件",
          value: "Intel Xeon E5-2620 v3 @ 2.40 GHz",
          detail: "16 线程并开启 SIMD；GPU 测试使用单卡 NVIDIA V100。",
        },
        {
          label: "测试工具",
          value: "pytest-benchmark",
          detail: "多次迭代测量端到端墙钟时间，结果以技术报告为准。",
        },
        {
          label: "数值精度",
          value: "FP64 与 FP32",
          detail: "MindQuantum 同时展示两种精度；TensorFlow Quantum 使用单精度 FP32。请在可比精度下阅读结果。",
        },
      ],
    },
    frameworks: {
      heading: "九个框架，一套环境。",
      lead: "以下为已发表测试采用的版本，并非当前版本。CPU 测试使用相同的线程配置与电路定义。",
      versionLabel: "版本",
      items: FRAMEWORKS,
    },
    reader: {
      original: "论文原图 · MindSpore Quantum 技术报告",
      enlarge: "放大查看",
      close: "关闭",
      zoom: "放大图表",
      fit: "适应宽度",
      openOriginal: "打开 PNG 原图",
      pan: "放大后可滚动或滑动查看。键盘操作：聚焦图表后使用方向键。",
      axes: "读图提示：纵轴为耗时（秒），采用对数坐标。越低越快；每个主刻度相差 10 倍。",
      precision: "MindQuantum：红色实线为 FP64，红色虚线为 FP32。保留原始图例与全部对比曲线。",
      cpuHardware: "CPU · 16 线程，SIMD",
      gpuHardware: "GPU · NVIDIA V100",
    },
    randomCircuit: {
      kicker: "01 / 底层模拟性能",
      heading: "随机电路演化，4 至 27 比特。",
      lead: "每个框架模拟同一条随机电路，门集合包含 X、Y、Z、H、CNOT、S、T、RX、RY、RZ、Rxx、Ryy、Rzz、SWAP 及其受控版本。比特数从 4 扩展到 27，使用 pytest-benchmark 计时。",
      cpuFigLabel: "图 1a — CPU 后端",
      gpuFigLabel: "图 1b — GPU 后端",
      cpuAlt:
        "对数坐标折线图：在 CPU 上对随机电路的模拟耗时进行对比，包含 MindQuantum（FP64 与 FP32）、Qulacs、PyQpanda、ProjectQ、PennyLane、Intel-QS 与 TensorFlow Quantum，比特数从 4 到 27。",
      gpuAlt:
        "对数坐标折线图：在单卡 NVIDIA V100 上对随机电路的 GPU 模拟耗时进行对比，包含 MindQuantum（FP64 与 FP32）、Qulacs、PennyLane 与 TensorFlow Quantum，比特数从 4 到 27。",
      cpuCaption:
        "MindQuantum 与 Qulacs 在所有比特数下均处于领先。13 比特处的小幅下凹来自 MindQuantum 在该阈值切换到 OpenMP 多线程；阈值以下单线程更快。",
      gpuCaption:
        "在单卡 V100 上，MindQuantum 一直保持领先直至 27 比特。TensorFlow Quantum 在高比特数下扩展更陡，但对比的是单精度对双精度。",
      finding:
        "MindQuantum 与 Qulacs 在底层实现上的优化已接近极限。",
      findingSource: "MindSpore Quantum 技术报告 · arXiv:2406.17248",
      findingHref: PAPER_HREF,
    },
    qaoa: {
      kicker: "02 / 端到端优化",
      heading: "QAOA 在 4-正则图上的最大割求解。",
      lead: "对一个真实的变分工作负载进行端到端计时：用一阶 Trotter 分解构造 QAOA 拟设电路，再通过 scipy.optimize.minimize 的 BFGS 方法优化至收敛。问题规模从 5 个节点扩展到 23 个；各框架在自身时间预算耗尽时停止，因此曲线终止比特数不一致。",
      cpuFigLabel: "图 2a — CPU 后端",
      gpuFigLabel: "图 2b — GPU 后端",
      cpuAlt:
        "对数坐标折线图：在 CPU 上对 QAOA 端到端求解耗时进行对比，包含 MindQuantum（FP64 与 FP32）、Qulacs、TensorCircuit（FP64 与 FP32）、TensorFlow Quantum、PennyLane 与 PyQpanda，比特数从 5 到 23。",
      gpuAlt:
        "对数坐标折线图：在单卡 NVIDIA V100 上对 QAOA 端到端求解耗时进行对比，包含 MindQuantum（FP64 与 FP32）、TensorFlow Quantum 与 PennyLane，比特数从 5 到 23。",
      cpuCaption:
        "MindQuantum 在整个比特范围内至少领先一个数量级。缺少高效伴随方法的框架在早期就掉队。",
      gpuCaption:
        "在 V100 上差距进一步拉大：PennyLane 在 14 比特处终止，TensorFlow Quantum 在 19 比特处终止，而 MindQuantum 跑到了 23 比特。",
      finding:
        "MindQuantum 至少比其他框架快一个数量级，这主要得益于其参数化电路梯度计算上经过优化的伴随方法与高效的电路演化实现。",
      findingSource: "MindSpore Quantum 技术报告 · arXiv:2406.17248",
      findingHref: PAPER_HREF,
    },
    cta: {
      heading: "复现这些基准。",
      lead: "本页所用的框架、电路与测试脚本均为开源代码。文中数据与文字摘自 MindSpore Quantum 技术报告；测试脚本与论文同仓库公开发布。",
      primary: { label: "阅读论文 · arXiv:2406.17248", href: PAPER_HREF },
      secondary: { label: "查看基准测试代码", href: BENCHMARK_CODE_HREF },
    },
  },
};
