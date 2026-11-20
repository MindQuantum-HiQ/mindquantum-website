import type { Lang } from "../config/i18n";

export type ComposerMessages = {
  metaDescription: string;
  /* Short label sitting above the page title. Used to signal that Composer
     is a standalone tool, not a sub-feature of MindQuantum (the framework
     and the editor are sibling products that happen to share this site). */
  eyebrow: string;
  title: string;
  subtitle: string;
  /* Honest framing for the future MindQuantum integration. Rendered as a
     small note below the subtitle. Generating MindQuantum code from a
     Composer circuit is on the roadmap, not a current capability — saying
     so up-front is what makes Composer's independence legible. */
  roadmapNote: string;
  qubits: string;
  measurementProbabilities: string;
  stateVector: string;
  gatePaletteLabel: string;
  singleQubitGates: string;
  rotationGates: string;
  twoQubitGates: string;
  placementHint: string;
  scrollHint: string;
  canvasLabel: string;
  trashLabel: string;
  emptyProbabilities: string;
  emptyStateVector: string;
};

export const COMPOSER_MESSAGES: Record<Lang, ComposerMessages> = {
  en: {
    metaDescription:
      "Composer is a browser-based visual editor for designing and inspecting quantum circuits. No install required.",
    eyebrow: "Standalone circuit editor",
    title: "Composer",
    subtitle:
      "Build quantum circuits and inspect probabilities and state vectors, entirely in your browser. No installation needed.",
    roadmapNote:
      "Roadmap: export your circuit as runnable MindQuantum Python code.",
    qubits: "Qubits",
    measurementProbabilities: "Measurement Probabilities",
    stateVector: "State vector",
    gatePaletteLabel: "Gate palette",
    singleQubitGates: "Single-qubit gates",
    rotationGates: "Rotation gates",
    twoQubitGates: "Two-qubit gates",
    placementHint: "Drag a gate onto a wire to begin. Results update automatically.",
    scrollHint: "Scroll horizontally to see all columns →",
    canvasLabel: "Quantum circuit canvas",
    trashLabel: "Drag a placed gate here to remove it",
    emptyProbabilities: "Place a gate to calculate measurement probabilities.",
    emptyStateVector: "Complex amplitudes will appear here as you build your circuit.",
  },
  zh: {
    metaDescription:
      "Composer 是浏览器中的可视化量子电路编辑器，拖放量子门即可设计与查看电路，无需安装。",
    eyebrow: "独立量子电路编辑器",
    title: "Composer",
    subtitle:
      "在浏览器中构建量子电路，实时查看测量概率与状态向量，无需安装。",
    roadmapNote: "路线图：将电路一键导出为可运行的 MindQuantum Python 代码。",
    qubits: "量子比特",
    measurementProbabilities: "测量概率",
    stateVector: "状态向量",
    gatePaletteLabel: "量子门",
    singleQubitGates: "单比特门",
    rotationGates: "旋转门",
    twoQubitGates: "双比特门",
    placementHint: "将量子门拖到线路上即可开始，结果会自动更新。",
    scrollHint: "左右滚动查看所有列 →",
    canvasLabel: "量子电路画布",
    trashLabel: "将已放置的量子门拖到此处删除",
    emptyProbabilities: "放置量子门后，即可查看测量概率。",
    emptyStateVector: "构建电路后，此处将显示各基态的复数振幅。",
  },
};
