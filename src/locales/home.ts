import type { Lang } from "../config/i18n";

export type HomeFeature = {
  title: string;
  description: string;
  image: "visual" | "hybrid" | "simulation" | "algorithm";
};

export type LearningCard = {
  icon: string;
  title: string;
  description: string;
  color: "primary" | "green" | "orange" | "teal";
  badge?: string;
  href: string;
};

export type HeroSlide = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  background: "quantum" | "internship" | "meeting";
  tone: "light" | "dark";
  actions: Array<{
    label: string;
    variant: "primary" | "orange" | "outline";
    href: string;
    icon?: "play";
    external?: boolean;
  }>;
};

export type ArchitectureRow = {
  label: string;
  cells: Array<string | null>;
};

export type HomeMessages = {
  metaDescription: string;
  announcement: {
    text: string;
    cta: string;
    href: string;
  };
  framework: {
    release: string;
    releaseHref: string;
    description: string;
    installCmd: string;
    installCopiedLabel: string;
    docsLabel: string;
  };
  architecture: {
    columnHeaders: [string, string, string];
    rows: ArchitectureRow[];
  };
  hero: {
    // Legacy fields (kept for backwards compatibility)
    title: string;
    subtitle: string;
    startLabel: string;
    repoLabel: string;
    slides: HeroSlide[];
  };
  features: {
    heading: string;
    items: HomeFeature[];
  };
  research: {
    heading: string;
    subtitle: string;
    universities: string[];
    featuredUniversities: string[];
  };
  learning: {
    heading: string;
    cards: LearningCard[];
  };
  cta: {
    title: string;
    installLabel: string;
    installHref: string;
    docsLabel: string;
    docsHref: string;
  };
  docs: {
    heading: string;
    blurbBeforeLink: string;
    linkLabel: string;
    blurbAfterLink: string;
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
      "MindSpore Quantum — a new generation, open-source, quantum-classical hybrid computing framework.",
    announcement: {
      text: "Experience quantum circuit visual programming online.",
      cta: "Quick Start",
      href: "/composer/",
    },
    framework: {
      release: "MindSpore Quantum V0.11 released",
      releaseHref: "/documentation/",
      description:
        "MindSpore Quantum is a new generation, open-source, quantum-classical hybrid computing framework launched by the MindSpore open-source community. It supports mainstream quantum algorithms and quantum-classical hybrid algorithms, providing an efficient environment for research and development in quantum computing.",
      installCmd: "pip install mindquantum",
      installCopiedLabel: "Copied",
      docsLabel: "Documentation",
    },
    architecture: {
      columnHeaders: [
        "Universal quantum algorithm",
        "Variational quantum algorithm",
        "Quantum inspired algorithm",
      ],
      rows: [
        {
          label: "Algorithm Library",
          cells: ["Grover / Shor / HHL", "VQE / QAOA / QNN", "SB / LQA / SimCIM"],
        },
        {
          label: "Quantum Neural Network",
          cells: ["Encoder", "Ansatz", "QRam"],
        },
        {
          label: "Compiler",
          cells: ["Quantum Circuit Compilation", "Qubit Mapping", null],
        },
        {
          label: "Domain Specific Language",
          cells: ["Quantum Gate", "Quantum Circuit", "Quantum Operator"],
        },
        {
          label: "Simulator",
          cells: [
            "Full Amplitude Simulator",
            "Density Matrix Simulator",
            "Quantum Chemistry Simulator",
          ],
        },
      ],
    },
    hero: {
      title: "MindQuantum",
      subtitle:
        "Build and simulate quantum circuits with performance, clarity, and delightful docs.",
      startLabel: "Start Learning",
      repoLabel: "Source Code",
      slides: [
        {
          title: "MindSpore Quantum",
          subtitle:
            "New Generation, Open-source, Quantum-classical Hybrid Computing Framework",
          background: "quantum",
          tone: "light",
          actions: [
            {
              label: "AtomGit",
              variant: "primary",
              href: "https://atomgit.com/mindspore/mindquantum",
              external: true,
            },
            {
              label: "GitHub",
              variant: "primary",
              href: "https://github.com/mindspore-ai/mindquantum",
              external: true,
            },
            {
              label: "Gitee",
              variant: "orange",
              href: "https://gitee.com/mindspore/mindquantum",
              external: true,
            },
          ],
        },
        {
          eyebrow: "Internship",
          title: "Online Open-Source Internship Tasks",
          subtitle:
            "Join the MindSpore Quantum community and contribute to real open-source quantum computing projects.",
          background: "internship",
          tone: "light",
          actions: [
            { label: "Learn More", variant: "primary", href: "/community/" },
            { label: "Task List", variant: "outline", href: "/community/" },
          ],
        },
        {
          eyebrow: "Community",
          title: "Quantum Computing Group Meeting",
          subtitle: "Live Every Monday 10 AM on Koushare and Bilibili",
          background: "meeting",
          tone: "dark",
          actions: [
            {
              label: "View Video",
              variant: "primary",
              href: "https://www.bilibili.com/",
              icon: "play",
              external: true,
            },
          ],
        },
      ],
    },
    features: {
      heading: "Features",
      items: [
        {
          title: "Visual Circuit Programming",
          description:
            "Provides a full-amplitude simulator, allowing developers to freely drag and drop quantum gates to build quantum circuits, with simple and easy-to-use operations.",
          image: "visual",
        },
        {
          title: "Hybrid Quantum-Classical",
          description:
            "Built on MindSpore's auto-differentiation engine, enabling seamless training of parameterized quantum circuits (PQC) and quantum neural networks.",
          image: "hybrid",
        },
        {
          title: "High-performance Simulation",
          description:
            "Support high-performance simulation logic tailored for CPU, GPU, and Ascend architectures, with flexible switching between single-precision and double-precision simulation modes.",
          image: "simulation",
        },
        {
          title: "Rich Algorithm Library",
          description:
            "Integrated implementations of VQE, QAOA, Grover Search, and Quantum Phase Estimation. Ready to use for chemistry and combinatorial optimization.",
          image: "algorithm",
        },
      ],
    },
    research: {
      heading: "Research",
      subtitle: "Over 100 papers researched based on MindSpore Quantum",
      universities: COMMON_UNIVERSITIES_EN,
      featuredUniversities: [
        "Peking University",
        "Tsinghua University",
        "Shanghai Jiao Tong University",
      ],
    },
    learning: {
      heading: "Start Learning",
      cards: [
        {
          icon: "🔬",
          title: "Beginner Developer",
          description:
            "Zero Foundation Introduction: This part of the course focuses on mastering the theoretical foundations of quantum information and computing.",
          color: "primary",
          href: "/learning/",
        },
        {
          icon: "🧩",
          title: "Intermediate Developer",
          description:
            "Learn how to install MindSpore Quantum on different systems, or quickly set up compilation and debugging for local development.",
          color: "green",
          href: "/learning/",
        },
        {
          icon: "🚀",
          title: "Advanced Developer",
          description:
            "Comprehensive case tutorials in the field of universal quantum algorithms and variational quantum algorithms that can help you quickly get started in related research.",
          color: "orange",
          href: "/learning/",
        },
        {
          icon: "🎬",
          title: "Video Courses",
          description:
            "Online courses covering introduction to quantum computing, MindSpore Quantum programming, case analysis, and practical applications.",
          color: "teal",
          badge: "Chinese",
          href: "/courses/",
        },
      ],
    },
    cta: {
      title: "Start building quantum programs with MindSpore Quantum",
      installLabel: "Install",
      installHref: "/documentation/",
      docsLabel: "Documentation",
      docsHref: "/documentation/",
    },
    docs: {
      heading: "Documentation",
      blurbBeforeLink: "Browse tutorials, examples, and API reference in the ",
      linkLabel: "documentation portal",
      blurbAfterLink: ".",
    },
    builder: {
      heading: "Interactive Circuit",
      qubits: "Qubits",
      measurementProbabilities: "Measurement Probabilities",
      stateVector: "State Vector",
    },
  },
  zh: {
    metaDescription: "MindSpore Quantum — 新一代开源量子-经典混合计算框架。",
    announcement: {
      text: "在线体验量子电路可视化编程。",
      cta: "快速开始",
      href: "/zh/composer/",
    },
    framework: {
      release: "MindSpore Quantum V0.11 发布",
      releaseHref: "/zh/documentation/",
      description:
        "MindSpore Quantum 是 MindSpore 开源社区推出的新一代开源量子-经典混合计算框架。它支持主流量子算法与量子-经典混合算法，为量子计算的研究与开发提供高效环境。",
      installCmd: "pip install mindquantum",
      installCopiedLabel: "已复制",
      docsLabel: "文档",
    },
    architecture: {
      columnHeaders: ["通用量子算法", "变分量子算法", "量子启发算法"],
      rows: [
        {
          label: "算法库",
          cells: ["Grover / Shor / HHL", "VQE / QAOA / QNN", "SB / LQA / SimCIM"],
        },
        {
          label: "量子神经网络",
          cells: ["编码器", "拟设", "QRam"],
        },
        {
          label: "编译器",
          cells: ["量子电路编译", "量子比特映射", null],
        },
        {
          label: "领域专用语言",
          cells: ["量子门", "量子电路", "量子算符"],
        },
        {
          label: "模拟器",
          cells: ["全振幅模拟器", "密度矩阵模拟器", "量子化学模拟器"],
        },
      ],
    },
    hero: {
      title: "MindQuantum",
      subtitle: "高性能、清晰易用的量子电路构建与模拟。",
      startLabel: "开始学习",
      repoLabel: "查看源码",
      slides: [
        {
          title: "MindSpore Quantum",
          subtitle: "新一代开源量子-经典混合计算框架",
          background: "quantum",
          tone: "light",
          actions: [
            {
              label: "AtomGit",
              variant: "primary",
              href: "https://atomgit.com/mindspore/mindquantum",
              external: true,
            },
            {
              label: "GitHub",
              variant: "primary",
              href: "https://github.com/mindspore-ai/mindquantum",
              external: true,
            },
            {
              label: "Gitee",
              variant: "orange",
              href: "https://gitee.com/mindspore/mindquantum",
              external: true,
            },
          ],
        },
        {
          eyebrow: "实习",
          title: "在线开源实习任务",
          subtitle:
            "加入 MindSpore Quantum 社区，为真实的开源量子计算项目贡献力量。",
          background: "internship",
          tone: "light",
          actions: [
            { label: "了解更多", variant: "primary", href: "/zh/community/" },
            { label: "任务列表", variant: "outline", href: "/zh/community/" },
          ],
        },
        {
          eyebrow: "社区",
          title: "量子计算组会",
          subtitle: "每周一上午 10 点在蔻享和哔哩哔哩直播",
          background: "meeting",
          tone: "dark",
          actions: [
            {
              label: "观看视频",
              variant: "primary",
              href: "https://www.bilibili.com/",
              icon: "play",
              external: true,
            },
          ],
        },
      ],
    },
    features: {
      heading: "核心特性",
      items: [
        {
          title: "可视化电路编程",
          description:
            "提供全振幅模拟器，开发者可以自由拖放量子门构建量子电路，操作简单易用。",
          image: "visual",
        },
        {
          title: "量子-经典混合",
          description:
            "基于 MindSpore 的自动微分引擎，无缝训练参数化量子电路（PQC）和量子神经网络。",
          image: "hybrid",
        },
        {
          title: "高性能模拟",
          description:
            "支持面向 CPU、GPU 与昇腾架构的高性能模拟逻辑，可在单精度与双精度模拟模式之间灵活切换。",
          image: "simulation",
        },
        {
          title: "丰富算法库",
          description:
            "集成 VQE、QAOA、Grover 搜索、量子相位估计等实现，可直接用于化学与组合优化。",
          image: "algorithm",
        },
      ],
    },
    research: {
      heading: "研究",
      subtitle: "超过 100 篇基于 MindSpore Quantum 的论文",
      universities: COMMON_UNIVERSITIES_ZH,
      featuredUniversities: ["北京大学", "清华大学", "上海交通大学"],
    },
    learning: {
      heading: "开始学习",
      cards: [
        {
          icon: "🔬",
          title: "入门开发者",
          description:
            "零基础入门：聚焦量子信息与计算的理论基础。",
          color: "primary",
          href: "/zh/learning/",
        },
        {
          icon: "🧩",
          title: "中级开发者",
          description:
            "学习在不同系统下安装 MindSpore Quantum，或快速搭建本地编译与调试环境。",
          color: "green",
          href: "/zh/learning/",
        },
        {
          icon: "🚀",
          title: "高级开发者",
          description:
            "通用量子算法与变分量子算法的全面案例教程，助你快速入门相关研究。",
          color: "orange",
          href: "/zh/learning/",
        },
        {
          icon: "🎬",
          title: "视频课程",
          description:
            "在线课程涵盖量子计算入门、MindSpore Quantum 编程、案例分析与实战应用。",
          color: "teal",
          badge: "中文",
          href: "/courses/",
        },
      ],
    },
    cta: {
      title: "使用 MindSpore Quantum 开启量子编程",
      installLabel: "安装",
      installHref: "/zh/documentation/",
      docsLabel: "文档",
      docsHref: "/zh/documentation/",
    },
    docs: {
      heading: "文档",
      blurbBeforeLink: "在 ",
      linkLabel: "文档中心",
      blurbAfterLink: " 浏览教程、示例与 API 参考。",
    },
    builder: {
      heading: "交互式电路",
      qubits: "量子比特数",
      measurementProbabilities: "测量概率",
      stateVector: "状态向量",
    },
  },
};
