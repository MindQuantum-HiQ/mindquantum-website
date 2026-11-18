import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export type BellExample = {
  code: string;
  expression: string;
  version: string;
  nQubits: number;
  gates: { name: string; targets: number[]; controls: number[] }[];
  stages: number[][];
  probabilities: number[];
};

// A single build-time execution is shared by both languages. No simulator,
// Python runtime, or numerical dependency is shipped to the homepage.
export const bellExample: BellExample = JSON.parse(execFileSync(
  process.env.PYTHON || 'python',
  [fileURLToPath(new URL('../../scripts/render-bell-example.py', import.meta.url))],
  { encoding: 'utf8' },
));
