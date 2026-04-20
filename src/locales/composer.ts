import type { Lang } from "../config/i18n";

export type ComposerMessages = {
  metaDescription: string;
  title: string;
  subtitle: string;
  qubitLabel: string;
  addQubit: string;
  measurementProbabilities: string;
  stateVector: string;
  gatePaletteLabel: string;
  columnsLabel: string;
};

export const COMPOSER_MESSAGES: Record<Lang, ComposerMessages> = {
  en: {
    metaDescription:
      "Drag and drop quantum gates to build and simulate circuits in the MindQuantum Composer.",
    title: "Composer",
    subtitle:
      "MindQuantum provides graphical quantum circuit programming with a full-amplitude simulator, allowing developers to freely drag and drop quantum gates to build quantum circuits.",
    qubitLabel: "Qubit",
    addQubit: "Add Qubit",
    measurementProbabilities: "Measurement Probabilities",
    stateVector: "Statevector",
    gatePaletteLabel: "Gate palette",
    columnsLabel: "Column",
  },
  zh: {
    metaDescription: "拖放量子门，在 MindQuantum 编辑器中构建并模拟量子电路。",
    title: "量子电路编辑器",
    subtitle:
      "MindQuantum 提供图形化的量子电路编程与全振幅模拟器，开发者可以自由拖放量子门来构建量子电路。",
    qubitLabel: "量子比特",
    addQubit: "添加量子比特",
    measurementProbabilities: "测量概率",
    stateVector: "状态向量",
    gatePaletteLabel: "量子门",
    columnsLabel: "列",
  },
};
