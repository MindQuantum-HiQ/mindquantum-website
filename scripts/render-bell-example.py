"""Execute the homepage's displayed Python, then trace each circuit prefix.

This runs at Astro build time, never in the reader's browser. Missing or
incompatible MindQuantum is a build error, not a pretext for sample results.
"""

import ast
import json
from pathlib import Path

from mindquantum import __version__
from mindquantum.simulator import Simulator

source = Path(__file__).resolve().parents[1] / 'src/lib/bell-state.py'
code = source.read_text(encoding='utf-8')
namespace = {}
exec(compile(code, str(source), 'exec'), namespace)
circuit = namespace['circ']

# Extract the displayed circuit expression from the executed source itself.
assignment = next(
    node for node in ast.parse(code).body
    if isinstance(node, ast.Assign) and any(
        isinstance(target, ast.Name) and target.id == 'circ' for target in node.targets
    )
)

stages = []
for count in range(len(circuit) + 1):
    sim = Simulator('mqvector', circuit.n_qubits)
    sim.apply_circuit(circuit[:count])
    stages.append((abs(sim.get_qs()) ** 2).tolist())

print(json.dumps({
    'code': code,
    'expression': ast.get_source_segment(code, assignment.value),
    'version': __version__,
    'nQubits': circuit.n_qubits,
    'gates': [
        {'name': gate.name, 'targets': gate.obj_qubits, 'controls': gate.ctrl_qubits}
        for gate in circuit
    ],
    'stages': stages,
    'probabilities': namespace['probabilities'].tolist(),
}))
