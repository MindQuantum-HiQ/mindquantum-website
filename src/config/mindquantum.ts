export const MINDQUANTUM = {
  packageName: "mindquantum",
  version: "0.12.0",
  python: { min: "3.9", max: "3.11" },
} as const;

export const INSTALL_COMMAND = `pip install ${MINDQUANTUM.packageName}==${MINDQUANTUM.version}`;
export const PYTHON_REQUIREMENT = `Python ${MINDQUANTUM.python.min}–${MINDQUANTUM.python.max}`;
export const STABLE_SERIES = MINDQUANTUM.version.split(".").slice(0, 2).join(".");
