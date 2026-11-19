from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X
from mindquantum.simulator import Simulator

circ = Circuit([H.on(0), X.on(1, 0)])
sim = Simulator('mqvector', 2)
sim.apply_circuit(circ)
probabilities = abs(sim.get_qs()) ** 2
