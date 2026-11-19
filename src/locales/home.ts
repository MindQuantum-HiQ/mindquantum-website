import type { Lang } from "../config/i18n";
import { INSTALL_COMMAND, PYTHON_REQUIREMENT } from "../config/mindquantum.ts";

export type HomeFeature = {
  /* A single "pillar" of the framework, shaped after the whitepaper's
     four-block architecture figure. No image field: per design brief,
     marketing surfaces avoid code-generated abstract decoration; the
     concrete component names in `keywords` carry the proof instead. */
  title: string;
  description: string;
  keywords: string[];
};

export type LearningCard = {
  title: string;
  description: string;
  href: string;
};

export type AnnouncementItem = {
  id: string;
  text: string;
  cta: string;
  href: string;
};

export type ArchitectureParadigm = {
  label: string;
  items: string;
  /* Optional deep-link override per paradigm cell. When set, the paradigm
     cell renders as its own anchor (e.g. Universal → algorithm.library,
     Variational → algorithm.nisq, Quantum-inspired → algorithm.qaia)
     instead of inheriting the layer-level href. Only used inside the
     Algorithm Library layer; the other four layers don't have paradigm
     subgroups at all. */
  href?: string;
};

/* A horizontal band in the framework architecture stack. The top layer
   (Algorithm Library) is the only one with a real "vertical" classification
   — Universal vs Variational vs Quantum-inspired paradigms — so it ships
   its own `paradigms` triple. The remaining layers (QNN, Compiler, DSL,
   Simulator) are flat component lists. Modelling those two cases as two
   different shapes keeps the diagram honest: paradigm columns no longer
   apply to layers that don't actually have paradigms. */
export type ArchitectureLayer = {
  label: string;
  href?: string;
  paradigms?: ArchitectureParadigm[];
  components?: string[];
};

export type HomeMessages = {
  metaDescription: string;
  announcements: AnnouncementItem[];
  framework: {
    release: string;
    releaseHref: string;
    installCmd: string;
    pythonRequirement: string;
  };
  architecture: {
    heading: string;
    layers: ArchitectureLayer[];
  };
  hero: {
    eyebrow?: string;
    headline: string[];
    description: string;
    ctaLabel: string;
    proofLinkHref: string;
    mirrorsLabel: string;
    opensInNewTab: string;
  };
  bell: {
    title: string;
    qubits: string;
    circuitDescription: string;
    probabilities: string;
    outcome: string;
    probability: string;
    stepsLabel: string;
    steps: [string, string, string];
    explanations: [string, string, string];
    summaries: [string, string, string];
    viewsLabel: string;
    resultLabel: string;
    pythonLabel: string;
    copyLabel: string;
    copiedLabel: string;
    copyFailedLabel: string;
    tutorialLabel: string;
    method: string;
  };
  features: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: HomeFeature[];
  };
  research: {
    heading: string;
    subtitle: string;
    universities: string[];
    featuredUniversities: string[];
    statement: string;
  };
  learning: {
    heading: string;
    description: string;
    installHeading: string;
    installLabel: string;
    installHref: string;
    docsLabel: string;
    docsHref: string;
    copyLabel: string;
    copiedLabel: string;
    copyFailedLabel: string;
    cards: LearningCard[];
  };
  builder?: {
    heading: string;
    qubits: string;
    stateVector: string;
    measurementProbabilities: string;
  };
};

const COMMON_UNIVERSITIES_EN = [
  "University of Science and Technology of China",
  "Hong Kong University",
  "Shanghai University",
  "Ocean University of China",
  "Tongji University",
  "South China University of Technology",
  "Beijing Normal University",
  "Wuhan University",
  "Anhui University",
  "Southwest University",
  "Xi'an University of Engineering",
  "Hubei University",
  "Zhejiang University",
  "University of Electronic Science and Technology",
  "Institute of Software of Chinese Academy of Sciences",
  "Tianjin University",
  "Harbin Institute of Technology",
  "Southern University of Science and Technology",
  "Beijing University of Posts and Telecommunications",
  "Central South University",
  "Beijing Institute of Technology",
  "Xidian University",
  "North China Electric Power University",
  "Nanjing University",
  "Sun Yat-sen University",
  "Fudan University",
  "Beijing Institute of Quantum Information Sciences",
];

const COMMON_UNIVERSITIES_ZH = [
  "中国科学技术大学",
  "香港大学",
  "上海大学",
  "中国海洋大学",
  "同济大学",
  "华南理工大学",
  "北京师范大学",
  "武汉大学",
  "安徽大学",
  "西南大学",
  "西安工程大学",
  "湖北大学",
  "浙江大学",
  "电子科技大学",
  "中科院软件所",
  "天津大学",
  "哈尔滨工业大学",
  "南方科技大学",
  "北京邮电大学",
  "中南大学",
  "北京理工大学",
  "西安电子科技大学",
  "华北电力大学",
  "南京大学",
  "中山大学",
  "复旦大学",
  "北京量子信息科学研究院",
];

export const HOME_MESSAGES: Record<Lang, HomeMessages> = {
  en: {
    metaDescription:
      "Open-source Python framework for parameterized quantum circuits. CPU, GPU, and Ascend backends. Auto-differentiation via MindSpore, with VQE, QAOA, and Grover built in.",
    announcements: [
      {
        id: "composer",
        text: "Composer — a standalone visual circuit editor that runs entirely in your browser.",
        cta: "Try Composer",
        href: "/composer/",
      },
    ],
    framework: {
      release: "MindSpore Quantum V0.12 released",
      releaseHref: "/docs/en/src/RELEASE/",
      installCmd: INSTALL_COMMAND,
      pythonRequirement: PYTHON_REQUIREMENT,
    },
    architecture: {
      heading: "Architecture",
      layers: [
        {
          label: "Algorithm Library",
          href: "/api/en/#/api_python_en/mindquantum.algorithm.html",
          paradigms: [
            {
              label: "Universal",
              items: "Grover / Shor / HHL",
              href: "/api/en/#/api_python_en/algorithm/mindquantum.algorithm.library.html",
            },
            {
              label: "Variational",
              items: "VQE / QAOA / QNN",
              href: "/api/en/#/api_python_en/algorithm/mindquantum.algorithm.nisq.html",
            },
            {
              label: "Quantum-inspired",
              items: "SB / LQA / SimCIM",
              href: "/api/en/#/api_python_en/algorithm/mindquantum.algorithm.qaia.html",
            },
          ],
        },
        {
          label: "Quantum Neural Network",
          href: "/api/en/#/api_python_en/algorithm/mindquantum.algorithm.nisq.html",
          components: ["Encoder", "Ansatz", "QRam"],
        },
        {
          label: "Compiler",
          href: "/api/en/#/api_python_en/algorithm/mindquantum.algorithm.compiler.html",
          components: ["Quantum Circuit Compilation", "Qubit Mapping"],
        },
        {
          label: "Domain Specific Language",
          href: "/api/en/#/api_python_en/mindquantum.core.html",
          components: ["Quantum Gate", "Quantum Circuit", "Quantum Operator"],
        },
        {
          label: "Simulator",
          href: "/api/en/#/api_python_en/mindquantum.simulator.html",
          components: [
            "Full Amplitude Simulator",
            "Density Matrix Simulator",
            "Quantum Chemistry Simulator",
          ],
        },
      ],
    },
    hero: {
      eyebrow: "Open source · MindSpore ecosystem",
      headline: ["Quantum circuits,", "differentiated", "end\u2011to\u2011end"],
      description:
        "Parameterized quantum circuits in Python. CPU, GPU, and Ascend backends. Auto-differentiation via MindSpore.",
      ctaLabel: "Get started",
      proofLinkHref: "/docs/en/src/beginner/quantum_simulator/",
      mirrorsLabel: "Source",
      opensInNewTab: "(opens in new tab)",
    },
    bell: {
      title: "Two qubits. One Bell state.",
      qubits: "|Φ⁺⟩",
      circuitDescription: "Two qubits start in zero. A Hadamard gate on q0 is followed by a controlled X from q0 to q1.",
      probabilities: "Measurement probabilities",
      outcome: "Outcome, q1 q0",
      probability: "Probability",
      stepsLabel: "Explore the circuit one step at a time",
      steps: ["Initial", "After H", "After CNOT"],
      explanations: [
        "Both qubits start in |0⟩. Measuring gives 00 every time.",
        "H puts q₀ in superposition: 00 and 01 are equally likely.",
        "CNOT entangles the pair. Only 00 or 11 can be measured, each with 50% probability.",
      ],
      summaries: [
        "00 with 100% probability.",
        "00 or 01, each with 50% probability.",
        "00 or 11, each with 50% probability.",
      ],
      viewsLabel: "Bell-state example views",
      resultLabel: "Circuit & result",
      pythonLabel: "Python",
      copyLabel: "Copy code",
      copiedLabel: "Code copied.",
      copyFailedLabel: "Copy failed. Select the code to copy it manually.",
      tutorialLabel: "Learn how the simulator works",
      method: "Exact statevector · computed at build time",
    },
    features: {
      eyebrow: "Core capabilities",
      heading: "User-friendly, high-performance, AI-compatible",
      lead:
        "MindSpore Quantum is built around the NISQ era. Four pillars take a quantum program from a Python expression to a real chip: a typed circuit DSL, differentiable circuits through MindSpore, three first-class simulator backends, and a batteries-included algorithm library.",
      items: [
        {
          title: "A Pythonic circuit DSL",
          description:
            "Quantum gates, circuits, parameter resolvers, and Hamiltonians as typed Python primitives. Arbitrary control on any gate, chain-rule circuit composition, and OpenQASM export.",
          keywords: [
            "Quantum Gate",
            "Quantum Circuit",
            "Parameter Resolver",
            "Observable",
          ],
        },
        {
          title: "Differentiable end to end",
          description:
            "Parameterized circuits differentiate through MindSpore's autograd via the adjoint method. VQE, QAOA, and QNN models compose with any MindSpore optimizer, an order of magnitude faster on QAOA than competing frameworks.",
          keywords: [
            "VQE",
            "QAOA",
            "QNN",
            "Adjoint gradient",
            "Ansatz library",
          ],
        },
        {
          title: "Three backends, one model",
          description:
            "State-vector and density-matrix simulators tuned per architecture: SIMD with OpenMP on x86, CUDA on NVIDIA, NEON on Ascend. Switch single- and double-precision per run, no recompile.",
          keywords: [
            "x86 (AVX)",
            "GPU (CUDA)",
            "Ascend (NEON)",
            "Noise channels",
          ],
        },
        {
          title: "Algorithms, batteries included",
          description:
            "VQE, QAOA, Grover, Shor, HHL, and Quantum Phase Estimation as one-line APIs. A dedicated VQE quantum-chemistry simulator is open-sourced in-tree, ready for LiH, H\u2082O, and beyond.",
          keywords: [
            "Grover",
            "Shor",
            "HHL",
            "QPE",
            "VQE chemistry simulator",
          ],
        },
      ],
    },
    research: {
      heading: "Research",
      subtitle: "Over 100 papers researched based on MindSpore Quantum",
      statement:
        "100+ peer-reviewed papers from 30+ institutions — including Peking University, Tsinghua, and Shanghai Jiao Tong.",
      universities: COMMON_UNIVERSITIES_EN,
      featuredUniversities: [
        "Peking University",
        "Tsinghua University",
        "Shanghai Jiao Tong University",
      ],
    },
    learning: {
      heading: "From your first circuit to your next idea",
      description: "Install once. Then follow a tutorial, explore an algorithm, or go straight to the API.",
      installHeading: "Set up MindQuantum",
      installLabel: "Installation guide",
      installHref: "/docs/en/src/mindquantum_install/",
      docsLabel: "All documentation",
      docsHref: "/documentation/",
      copyLabel: "Copy command",
      copiedLabel: "Copied",
      copyFailedLabel: "Select the command and copy it manually.",
      cards: [
        {
          title: "Quantum foundations",
          description:
            "Zero-foundation introduction to quantum information and computing — the math, the postulates, and the vocabulary you need before writing any circuit.",
          href: "/learning/",
        },
        {
          title: "API reference",
          description:
            "Find the interfaces for circuits, gates, simulators, and differentiable algorithms.",
          href: "/api/en/",
        },
        {
          title: "Algorithm case studies",
          description:
            "Runnable walkthroughs of VQE, QAOA, Grover, and quantum phase estimation — the jumping-off point for research work.",
          href: "/docs/en/",
        },
      ],
    },
    builder: {
      heading: "Interactive Circuit",
      qubits: "Qubits",
      measurementProbabilities: "Measurement Probabilities",
      stateVector: "State Vector",
    },
  },
  zh: {
    metaDescription:
      "开源 Python 量子框架。支持参数化量子电路与量子-经典混合算法，可在 CPU、GPU 与昇腾上运行，通过 MindSpore 实现自动微分，内置 VQE、QAOA 与 Grover。",
    announcements: [
      {
        id: "composer",
        text: "Composer——独立的可视化量子电路编辑器，完全运行于浏览器中。",
        cta: "试用 Composer",
        href: "/zh/composer/",
      },
    ],
    framework: {
      release: "MindSpore Quantum V0.12 发布",
      releaseHref: "/docs/zh/src/RELEASE/",
      installCmd: INSTALL_COMMAND,
      pythonRequirement: PYTHON_REQUIREMENT,
    },
    architecture: {
      heading: "框架架构",
      layers: [
        {
          label: "算法库",
          href: "/api/zh/#/api_python/mindquantum.algorithm.html",
          paradigms: [
            {
              label: "通用算法",
              items: "Grover / Shor / HHL",
              href: "/api/zh/#/api_python/algorithm/mindquantum.algorithm.library.html",
            },
            {
              label: "变分算法",
              items: "VQE / QAOA / QNN",
              href: "/api/zh/#/api_python/algorithm/mindquantum.algorithm.nisq.html",
            },
            {
              label: "量子启发算法",
              items: "SB / LQA / SimCIM",
              href: "/api/zh/#/api_python/algorithm/mindquantum.algorithm.qaia.html",
            },
          ],
        },
        {
          label: "量子神经网络",
          href: "/api/zh/#/api_python/algorithm/mindquantum.algorithm.nisq.html",
          components: ["编码器", "拟设", "QRam"],
        },
        {
          label: "编译器",
          href: "/api/zh/#/api_python/algorithm/mindquantum.algorithm.compiler.html",
          components: ["量子电路编译", "量子比特映射"],
        },
        {
          label: "领域专用语言",
          href: "/api/zh/#/api_python/mindquantum.core.html",
          components: ["量子门", "量子电路", "量子算符"],
        },
        {
          label: "模拟器",
          href: "/api/zh/#/api_python/mindquantum.simulator.html",
          components: ["全振幅模拟器", "密度矩阵模拟器", "量子化学模拟器"],
        },
      ],
    },
    hero: {
      eyebrow: "开源 · MindSpore 生态",
      headline: ["端到端可微分的", "量子电路"],
      description:
        "用 Python 编写量子电路，通过 MindSpore 自动微分，在 CPU、GPU 与昇腾上运行。",
      ctaLabel: "开始使用",
      proofLinkHref: "/docs/zh/src/beginner/quantum_simulator/",
      mirrorsLabel: "源代码",
      opensInNewTab: "（在新标签页打开）",
    },
    bell: {
      title: "两个量子比特，一个 Bell 态。",
      qubits: "|Φ⁺⟩",
      circuitDescription: "两个量子比特从零态出发，先在 q0 上施加 Hadamard 门，再施加从 q0 控制 q1 的受控 X 门。",
      probabilities: "测量概率",
      outcome: "测量结果，q1 q0",
      probability: "概率",
      stepsLabel: "逐步查看量子电路的计算过程",
      steps: ["初始态", "H 门之后", "CNOT 之后"],
      explanations: [
        "两个量子比特均从 |0⟩ 出发，测量结果始终为 00。",
        "H 门使 q₀ 进入叠加态，00 与 01 的测量概率相等。",
        "CNOT 使两个量子比特纠缠，测量只会得到 00 或 11，各占 50%。",
      ],
      summaries: [
        "测量结果始终为 00。",
        "测量得到 00 或 01，各占 50%。",
        "测量得到 00 或 11，各占 50%。",
      ],
      viewsLabel: "Bell 态示例视图",
      resultLabel: "电路与结果",
      pythonLabel: "Python",
      copyLabel: "复制代码",
      copiedLabel: "代码已复制。",
      copyFailedLabel: "复制失败，请选中代码手动复制。",
      tutorialLabel: "了解模拟器的工作方式",
      method: "精确态向量 · 构建时计算",
    },
    features: {
      eyebrow: "核心能力",
      heading: "用户友好、高性能、AI 兼容",
      lead:
        "MindSpore Quantum 面向 NISQ 时代构建。四大支柱将量子程序从一行 Python 表达式带到真实量子芯片：类型化的电路 DSL、通过 MindSpore 端到端可微分的电路、三套一等公民的模拟器后端，以及开箱即用的算法库。",
      items: [
        {
          title: "Python 原生电路 DSL",
          description:
            "量子门、量子电路、参数解析器与哈密顿量皆以类型化 Python 原语呈现。任意门支持任意控制位，电路可链式组合，并可导出 OpenQASM。",
          keywords: [
            "量子门",
            "量子电路",
            "参数解析器",
            "可观测量",
          ],
        },
        {
          title: "端到端可微分",
          description:
            "参数化量子电路通过 MindSpore 自动微分引擎求导，采用伴随方法实现高效梯度计算。VQE、QAOA 与 QNN 可直接接入任意 MindSpore 优化器，QAOA 任务较同类框架快一个数量级以上。",
          keywords: [
            "VQE",
            "QAOA",
            "QNN",
            "伴随梯度",
            "拟设库",
          ],
        },
        {
          title: "三种后端，统一模型",
          description:
            "全振幅与密度矩阵模拟器针对各架构优化：x86 上使用 SIMD 与 OpenMP，NVIDIA 上使用 CUDA，昇腾上使用 NEON。单精度与双精度可在运行时切换，无需重新编译。",
          keywords: [
            "x86 (AVX)",
            "GPU (CUDA)",
            "昇腾 (NEON)",
            "噪声信道",
          ],
        },
        {
          title: "算法开箱即用",
          description:
            "VQE、QAOA、Grover、Shor、HHL 与量子相位估计均提供一行式 API。专为 VQE 设计的量子化学模拟器已在 MindQuantum 中开源集成，可直接用于 LiH、H\u2082O 等分子的求解。",
          keywords: [
            "Grover",
            "Shor",
            "HHL",
            "QPE",
            "VQE 化学模拟器",
          ],
        },
      ],
    },
    research: {
      heading: "研究",
      subtitle: "超过 100 篇基于 MindSpore Quantum 的论文",
      statement:
        "超过 100 篇同行评审论文，覆盖 30 余所院校——包括北京大学、清华大学与上海交通大学。",
      universities: COMMON_UNIVERSITIES_ZH,
      featuredUniversities: ["北京大学", "清华大学", "上海交通大学"],
    },
    learning: {
      heading: "从第一个电路，到下一个想法",
      description: "安装 MindQuantum，选择适合你的起点：基础教程、算法案例或 API 参考。",
      installHeading: "安装 MindQuantum",
      installLabel: "安装指南",
      installHref: "/docs/zh/src/mindquantum_install/",
      docsLabel: "全部文档",
      docsHref: "/zh/documentation/",
      copyLabel: "复制命令",
      copiedLabel: "已复制",
      copyFailedLabel: "请选择命令并手动复制。",
      cards: [
        {
          title: "量子基础",
          description:
            "零基础入门：量子信息与计算的数学基础、基本假设与术语，先学透再写代码。",
          href: "/zh/learning/",
        },
        {
          title: "API 参考",
          description:
            "直接查阅量子电路、量子门、模拟器与可微分算法的接口。",
          href: "/api/zh/",
        },
        {
          title: "算法案例精讲",
          description:
            "VQE、QAOA、Grover 与量子相位估计的可运行案例——快速进入研究工作的起点。",
          href: "/docs/zh/",
        },
      ],
    },
    builder: {
      heading: "交互式电路",
      qubits: "量子比特数",
      measurementProbabilities: "测量概率",
      stateVector: "状态向量",
    },
  },
};
