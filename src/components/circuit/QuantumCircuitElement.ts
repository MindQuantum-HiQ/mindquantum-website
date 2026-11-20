// Vanilla web component implementing the interactive circuit builder
// UI logic is encapsulated here; simulation runs in a web worker.

import type { Circuit, GatePlacement, GateType } from "../../lib/circuit/model";
import controlStyles from "../../styles/controls.css?inline";
import circuitStyles from "./styles.css?inline";
import { createEmptyCircuit, ensureColumns, addGate, removeGateById, moveGateById, validatePlacement, serializeCircuit } from "../../lib/circuit/model";
import { GATE_REGISTRY } from "../../lib/circuit/gates";
import { isRotationGate, rotationAngle, createRotationPlacement, type RotationGateType } from "../../lib/circuit/model";
import { COMPOSER_MESSAGES, type ComposerMessages } from "../../locales/composer";
import type { Lang } from "../../config/i18n";

type RunResult = {
  statevector?: { re: number[]; im: number[] };
  probs?: number[];
  error?: { code: string; message: string };
};

const MAX_QUBITS = 6;
const MIN_QUBITS = 2;
const DEFAULT_QUBITS = 3;
const DEFAULT_COLUMNS = 12;

// The Shadow DOM owns geometry, not a palette. Shared controls are compiled
// into the shadow stylesheet; semantic tokens inherit from the site root.
const TEMPLATE_STYLES = `<style>${controlStyles}\n${circuitStyles}</style>`;

const templateHTML = (messages: ComposerMessages) => /* html */ `
  ${TEMPLATE_STYLES}
  <div class="mqcb-root" part="root">
    <div class="mqcb-topbar">
      <h2 class="mqcb-subheading">${messages.gatePaletteLabel}</h2>
      <div class="mqcb-controls">
        <label>
          <span class="mqcb-label">${messages.qubits}</span>
          <select class="mqcb-qubits">
            ${Array.from({ length: MAX_QUBITS - MIN_QUBITS + 1 }, (_, i) => MIN_QUBITS + i)
              .map((n) => `<option value="${n}">${n}</option>`)
              .join("")}
          </select>
        </label>
      </div>
      <div class="mqcb-palette" role="group" aria-label="${messages.gatePaletteLabel}"></div>
      <p class="mqcb-placement-hint">${messages.placementHint}</p>
    </div>

    <div class="mqcb-canvas" tabindex="0" aria-label="${messages.canvasLabel}" role="application">
      <!-- grid injected -->
    </div>
    <p class="mqcb-scroll-hint">${messages.scrollHint}</p>
    <div class="mqcb-trash">${messages.trashLabel}</div>

    <div class="mqcb-results" aria-live="polite">
      <div class="mqcb-results-body">
        <div class="mqcb-probs">
          <h2 class="mqcb-subheading">${messages.measurementProbabilities}</h2>
          <p class="mqcb-results-empty">${messages.emptyProbabilities}</p>
          <div class="mqcb-problist"></div>
        </div>
        <div class="mqcb-state-section">
          <h2 class="mqcb-subheading">${messages.stateVector}</h2>
          <p class="mqcb-results-empty">${messages.emptyStateVector}</p>
          <div class="mqcb-state"></div>
        </div>
        <div class="mqcb-error" hidden></div>
      </div>
    </div>

    <div class="mqcb-toast" aria-live="assertive" hidden></div>
  </div>
`;

function debounce<T extends (...a: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

class QuantumCircuitElement extends HTMLElement {
  static tag = "mq-circuit-builder";
  private root!: ShadowRoot;
  private circuit: Circuit = createEmptyCircuit(DEFAULT_QUBITS, DEFAULT_COLUMNS);
  private selectedGateId: string | null = null;
  private autoRunDebounced: () => void;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.autoRunDebounced = debounce(() => this.runSimulation(), 300);
  }

  connectedCallback() {
    this.render();
    // Worker disabled - using main thread for simulation
    // this.ensureWorker();
    this.bindEvents();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  private render() {
    this.root.innerHTML = templateHTML(this.messages);
    this.renderPalette();
    this.renderGrid();
  }

  private get messages() {
    return COMPOSER_MESSAGES[this.lang as Lang];
  }

  private bindEvents() {
    const qubitsSel = this.qs<HTMLSelectElement>(".mqcb-qubits");
    qubitsSel.value = String(this.circuit.nQubits);
    qubitsSel.addEventListener("change", () => this.onChangeQubits(parseInt(qubitsSel.value, 10)));

    const canvas = this.qs<HTMLElement>(".mqcb-canvas");
    canvas.addEventListener("keydown", (e) => this.onCanvasKeyDown(e as KeyboardEvent));

    const trash = this.qs<HTMLElement>(".mqcb-trash");
    trash.addEventListener("dragover", (e) => {
      if (this.selectedGateId) {
        e.preventDefault();
        trash.classList.add("over");
      }
    });
    trash.addEventListener("dragleave", () => trash.classList.remove("over"));
    trash.addEventListener("drop", (e) => this.onTrashDrop(e));
  }

  private qs<T extends Element>(sel: string): T {
    const el = this.root.querySelector(sel);
    if (!el) throw new Error(`Missing element ${sel}`);
    return el as T;
  }

  // Palette rendering and drag start
  private renderPalette() {
    const pal = this.qs<HTMLDivElement>(".mqcb-palette");
    pal.innerHTML = "";
    const families: { label: string; gates: GateType[] }[] = [
      { label: this.messages.singleQubitGates, gates: ["H", "X", "Y", "Z", "S", "T"] },
      { label: this.messages.rotationGates, gates: ["RX", "RY", "RZ"] },
      { label: this.messages.twoQubitGates, gates: ["CNOT", "CZ", "SWAP"] },
    ];
    for (const family of families) {
      const group = document.createElement("div");
      group.className = "mqcb-gate-family";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", family.label);
      for (const type of family.gates) {
        const g = GATE_REGISTRY[type];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `mq-btn mq-btn-outline mq-btn-compact mqcb-gate mqcb-g-${g.type.toLowerCase()}`;
        btn.textContent = g.label;
        btn.draggable = true;
        btn.dataset.gate = g.type;
        btn.title = g.title || g.label;
        btn.addEventListener("dragstart", (e) => {
          if (!e.dataTransfer) return;
          e.dataTransfer.setData("application/x-mq-gate", g.type);
          e.dataTransfer.setData("text/plain", g.type);
          e.dataTransfer.effectAllowed = "copy";
        });
        group.appendChild(btn);
      }
      pal.appendChild(group);
    }
  }

  // Grid rendering and drag/drop handlers
  private renderGrid() {
    const canvas = this.qs<HTMLDivElement>(".mqcb-canvas");
    canvas.innerHTML = "";

    // Ensure column count
    this.circuit = ensureColumns(this.circuit, Math.max(this.circuit.columns.length, DEFAULT_COLUMNS));

    // Build grid
    const table = document.createElement("div");
    table.className = "mqcb-grid";
    table.style.gridTemplateColumns = `3rem repeat(${this.circuit.columns.length}, minmax(48px, 1fr))`;

    // Header row (time indices)
    const header = document.createElement("div");
    header.className = "mqcb-row mqcb-header";
    header.appendChild(document.createElement("div")); // empty corner
    for (let t = 0; t < this.circuit.columns.length; t++) {
      const h = document.createElement("div");
      h.className = "mqcb-cell mqcb-time";
      h.textContent = String(t + 1);
      header.appendChild(h);
    }
    table.appendChild(header);

    // Qubit rows
    for (let q = 0; q < this.circuit.nQubits; q++) {
      const row = document.createElement("div");
      row.className = "mqcb-row";
      const label = document.createElement("div");
      label.className = "mqcb-cell mqcb-wirelabel";
      label.textContent = `q${q}`;
      row.appendChild(label);

      for (let t = 0; t < this.circuit.columns.length; t++) {
        const col = this.circuit.columns[t];
        const cell = document.createElement("div");
        cell.className = "mqcb-cell mqcb-drop";
        cell.dataset.q = String(q);
        cell.dataset.t = String(t);

        // Wire line
        const wire = document.createElement("div");
        wire.className = "mqcb-wire";
        cell.appendChild(wire);

        // Render gate if present
        const item = col.items[q];
        if (item) {
          const gateEl = this.renderGateChip(item, q, t);
          cell.appendChild(gateEl);
        }

        // Drag & drop events
        cell.addEventListener("dragover", (e) => this.onCellDragOver(e));
        cell.addEventListener("dragleave", (e) => this.onCellDragLeave(e));
        cell.addEventListener("drop", (e) => this.onCellDrop(e));
        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    canvas.appendChild(table);
  }

  private renderGateChip(g: GatePlacement, q: number, t: number) {
    const chip = document.createElement("button");
    chip.className = `mqcb-chip mqcb-g-${g.type.toLowerCase()} ${this.selectedGateId === g.id ? "selected" : ""}`;
    chip.type = "button";
    chip.setAttribute("aria-pressed", String(this.selectedGateId === g.id));
    
    // Use different symbols for two-qubit gates
    if (g.type === "CNOT") {
      const isTarget = g.targets.includes(q);
      if (isTarget) {
        chip.textContent = ""; // Cross created with CSS pseudo-elements
        chip.classList.add("cnot-target");
        chip.title = "CNOT Target";
      } else {
        chip.textContent = ""; // No text for control - just a solid dot
        chip.classList.add("cnot-control");
        chip.title = "CNOT Control";
      }
    } else if (g.type === "CZ") {
      // CZ has control dots on both qubits
      chip.textContent = "";
      chip.classList.add("cz-dot");
      chip.title = "Controlled-Z";
    } else if (g.type === "SWAP") {
      // SWAP has X symbols on both qubits - created with CSS pseudo-elements
      chip.textContent = "";
      chip.classList.add("swap-x");
      chip.title = "SWAP";
    } else {
      // Get label from registry for single-qubit gates
      const gateDef = GATE_REGISTRY[g.type];
      chip.textContent = gateDef?.label || g.type;
      
      // Add angle display for rotation gates
      if (isRotationGate(g.type)) {
        const angle = rotationAngle(g);
        // Display angle as fraction of π
        const piValue = angle / Math.PI;
        const displayValue = piValue.toFixed(2).replace(/\.?0+$/, "");
        chip.textContent = `${gateDef?.label}(${displayValue}π)`;
        chip.style.fontSize = "0.65rem";
      }
    }
    
    chip.setAttribute("data-id", g.id);
    chip.draggable = true;
    chip.addEventListener("click", () => this.onGateClick(g.id));
    chip.addEventListener("dragstart", (e) => this.onGateDragStart(e, g.id));
    chip.addEventListener("dragend", () => this.clearDragHighlights());

    // Draw vertical lines for two-qubit gates
    if ((g.type === "CNOT" || g.type === "CZ" || g.type === "SWAP") && 
        ((g.controls && g.controls.length > 0) || (g.targets && g.targets.length > 1))) {
      // Create a separate line element that spans between qubits
      setTimeout(() => {
        let q1: number, q2: number;
        let lineClass: string;
        
        if (g.type === "CNOT" && g.controls && g.controls.length > 0) {
          q1 = g.controls[0];
          q2 = g.targets[0];
          lineClass = "mqcb-cnot-line";
        } else if (g.type === "CZ" && g.controls && g.controls.length > 0) {
          q1 = g.controls[0];
          q2 = g.targets[0];
          lineClass = "mqcb-cz-line";
        } else if (g.type === "SWAP" && g.targets.length >= 2) {
          q1 = g.targets[0];
          q2 = g.targets[1];
          lineClass = "mqcb-swap-line";
        } else {
          return;
        }
        
        const minQ = Math.min(q1, q2);
        
        // Only add line from the top qubit
        if (q === minQ) {
          const cell1 = this.root.querySelector(`.mqcb-cell.mqcb-drop[data-q="${q1}"][data-t="${t}"]`);
          const cell2 = this.root.querySelector(`.mqcb-cell.mqcb-drop[data-q="${q2}"][data-t="${t}"]`);
          
          if (cell1 && cell2) {
            const rect1 = cell1.getBoundingClientRect();
            const rect2 = cell2.getBoundingClientRect();
            const cellRect = cell1.getBoundingClientRect();
            
            const line = document.createElement("div");
            line.className = lineClass;
            line.style.height = `${Math.abs(rect2.top - rect1.top)}px`;
            line.style.top = q1 < q2 ? "50%" : `${-(Math.abs(rect2.top - rect1.top) - cellRect.height/2)}px`;
            cell1.appendChild(line);
          }
        }
      }, 0); // Defer to ensure DOM is ready
    }

    return chip;
  }

  private onGateClick(id: string) {
    // Check if this is a rotation gate - if so, allow editing angle
    const gate = this.findGateById(id);
    if (gate && isRotationGate(gate.type)) {
      // Find the gate position
      let t = -1, q = -1;
      for (let ti = 0; ti < this.circuit.columns.length; ti++) {
        for (let qi = 0; qi < this.circuit.nQubits; qi++) {
          if (this.circuit.columns[ti].items[qi]?.id === id) {
            t = ti;
            q = qi;
            break;
          }
        }
        if (t >= 0) break;
      }
      
      if (t >= 0 && q >= 0) {
        // Remove old gate and prompt for new angle
        this.circuit = removeGateById(this.circuit, id);
        this.renderGrid();
        this.promptRotationAngle(t, q, gate.type, id);
        return;
      }
    }
    
    this.selectedGateId = this.selectedGateId === id ? null : id;
    this.renderGrid();
    // Focus the canvas to enable keyboard shortcuts
    const canvas = this.qs<HTMLElement>(".mqcb-canvas");
    canvas.focus();
  }

  private onGateDragStart(e: DragEvent, id: string) {
    this.selectedGateId = id;
    e.dataTransfer?.setData("application/x-mq-move", id);
    e.dataTransfer?.setData("text/plain", id);
    e.dataTransfer!.effectAllowed = "move";
    // Highlight potential drop targets
    this.highlightValidTargetsForMove(id);
  }

  private highlightValidTargetsForMove(_id: string) {
    // For simplicity, allow moving to any empty cell in any column; validation on drop
    const cells = this.root.querySelectorAll<HTMLElement>(`.mqcb-cell.mqcb-drop`);
    cells.forEach((c) => c.classList.add("maybe"));
  }

  private clearDragHighlights() {
    this.root.querySelectorAll<HTMLElement>(`.mqcb-cell.mqcb-drop.maybe, .mqcb-cell.mqcb-drop.valid, .mqcb-cell.mqcb-drop.invalid`).forEach((c) => {
      c.classList.remove("maybe", "valid", "invalid", "over");
    });
    this.root.querySelectorAll<HTMLElement>(`.mqcb-trash.over`).forEach((c) => c.classList.remove("over"));
  }

  private onCellDragOver(e: DragEvent) {
    const dt = e.dataTransfer;
    const cell = e.currentTarget as HTMLElement;
    const q = parseInt(cell.dataset.q || "-1", 10);
    const t = parseInt(cell.dataset.t || "-1", 10);
    
    if (!dt || q < 0 || t < 0) {
      return;
    }
    
    // Check if this is a gate drag or a move drag
    const hasGate = Array.from(dt.types).some(type => type === "application/x-mq-gate" || type === "text/plain");
    const hasMove = Array.from(dt.types).some(type => type === "application/x-mq-move");
    
    if (hasGate || hasMove) {
      e.preventDefault();
      
      // We can't actually read the data during dragover due to browser security
      // So we just prevent default and add visual feedback
      cell.classList.add("over");
      cell.classList.add("valid");
    }
  }

  private onCellDragLeave(e: DragEvent) {
    const cell = e.currentTarget as HTMLElement;
    cell.classList.remove("over", "valid", "invalid");
  }

  private onCellDrop(e: DragEvent) {
    e.preventDefault();
    const cell = e.currentTarget as HTMLElement;
    const q = parseInt(cell.dataset.q || "-1", 10);
    const t = parseInt(cell.dataset.t || "-1", 10);
    
    if (!e.dataTransfer || q < 0 || t < 0) return;
    
    const dt = e.dataTransfer;
    
    // Try to get gate type or move ID from dataTransfer
    let gateType: GateType | null = null;
    let moveId: string | null = null;
    
    try {
      // Try to get custom MIME type first
      const customGate = dt.getData("application/x-mq-gate");
      if (customGate) {
        gateType = customGate as GateType;
      }
      const customMove = dt.getData("application/x-mq-move");
      if (customMove) {
        moveId = customMove;
      }
    } catch (e) {
      // Fallback to text/plain if custom type fails
      const plainText = dt.getData("text/plain");
      if (plainText && ["H", "X", "Z", "CNOT"].includes(plainText)) {
        gateType = plainText as GateType;
      }
    }

    if (gateType) {
      if (gateType === "CNOT") {
        // Place placeholder and ask for control wire selection
        const id = `g_${Math.random().toString(36).slice(2)}`;
        const candidate: GatePlacement = { type: "CNOT", targets: [q], controls: [], id };
        const valid = validatePlacement(this.circuit, t, candidate).ok;
        if (!valid) return this.toast("Invalid placement");
        // Commit target only for now
        this.circuit = addGate(this.circuit, t, candidate, { occupyInvolved: false });
        this.renderGrid();
        this.promptControlWire(t, id, q);
        return;
      } else if (gateType === "CZ") {
        // CZ needs two qubits - place first and prompt for second
        const id = `g_${Math.random().toString(36).slice(2)}`;
        const candidate: GatePlacement = { type: "CZ", targets: [q], controls: [], id };
        const valid = validatePlacement(this.circuit, t, candidate).ok;
        if (!valid) return this.toast("Invalid placement");
        this.circuit = addGate(this.circuit, t, candidate, { occupyInvolved: false });
        this.renderGrid();
        this.promptSecondQubit(t, id, q, "CZ");
        return;
      } else if (gateType === "SWAP") {
        // SWAP needs two qubits - place first and prompt for second
        const id = `g_${Math.random().toString(36).slice(2)}`;
        const candidate: GatePlacement = { type: "SWAP", targets: [q], id };
        const valid = validatePlacement(this.circuit, t, candidate).ok;
        if (!valid) return this.toast("Invalid placement");
        this.circuit = addGate(this.circuit, t, candidate, { occupyInvolved: false });
        this.renderGrid();
        this.promptSecondQubit(t, id, q, "SWAP");
        return;
      } else if (isRotationGate(gateType)) {
        // Rotation gates need angle parameter
        const id = `g_${Math.random().toString(36).slice(2)}`;
        this.promptRotationAngle(t, q, gateType, id);
        return;
      } else {
        const id = `g_${Math.random().toString(36).slice(2)}`;
        const placement: GatePlacement = { type: gateType, targets: [q], id };
        const valid = validatePlacement(this.circuit, t, placement).ok;
        if (!valid) return this.toast("Invalid placement");
        this.circuit = addGate(this.circuit, t, placement);
      }
    } else if (moveId) {
      const gate = this.findGateById(moveId);
      if (!gate) return;
      const placement: GatePlacement = { ...gate, targets: [q] };
      const valid = validatePlacement(this.circuit, t, placement, moveId).ok;
      if (!valid) return this.toast("Invalid placement");
      this.circuit = moveGateById(this.circuit, moveId, t, q);
    }

    this.clearSelection();
    this.clearDragHighlights();
    this.renderGrid();
    this.autoRunDebounced();
  }

  private onTrashDrop(e: DragEvent) {
    e.preventDefault();
    this.clearDragHighlights();
    const dt = e.dataTransfer!;
    const moveId = dt.getData("application/x-mq-move");
    if (moveId) {
      this.circuit = removeGateById(this.circuit, moveId);
      this.clearSelection();
      this.renderGrid();
      this.autoRunDebounced();
    }
  }

  private promptControlWire(t: number, gateId: string, targetQ: number) {
    // Lightweight overlay effect: highlight wire labels and wait for a click
    const canvas = this.qs<HTMLElement>(".mqcb-canvas");
    canvas.classList.add("selecting-control");
    const cleanup = () => canvas.classList.remove("selecting-control");
    this.toast("Select control wire");
    const handler = (e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest(".mqcb-cell.mqcb-drop") as HTMLElement | null;
      if (!cell) return;
      const q = parseInt(cell.dataset.q || "-1", 10);
      if (q === targetQ) {
        this.toast("Control cannot equal target");
        return;
      }
      // Update the placeholder CNOT with selected control
      const gate = this.findGateById(gateId);
      if (!gate) return;
      const updated: GatePlacement = { ...gate, controls: [q] };
      const valid = validatePlacement(this.circuit, t, updated).ok;
      if (!valid) {
        this.toast("Invalid placement");
        cleanup();
        canvas.removeEventListener("click", handler);
        this.circuit = removeGateById(this.circuit, gateId);
        this.renderGrid();
        return;
      }
      // Commit occupancy for control
      this.circuit = addGate(this.circuit, t, updated, { overwrite: true });
      cleanup();
      canvas.removeEventListener("click", handler);
      this.renderGrid();
      this.autoRunDebounced();
    };
    canvas.addEventListener("click", handler);
  }

  private promptRotationAngle(t: number, q: number, gateType: RotationGateType, id: string) {
    // Create a simple dialog for angle input
    const dialog = document.createElement("div");
    dialog.className = "mqcb-param-dialog";
    
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "0.5rem";
    label.textContent = `Enter angle for ${gateType} (in units of π):`;
    
    const input = document.createElement("input");
    input.type = "number";
    input.value = "0.25";
    input.step = "0.125";
    input.style.cssText = `
      width: 100%;
      padding: 0.25rem;
      margin-bottom: 0.5rem;
    `;
    
    const btnContainer = document.createElement("div");
    btnContainer.style.cssText = "display: flex; gap: 0.5rem; justify-content: flex-end;";
    
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "mq-btn mq-btn-outline mq-btn-compact";
    cancelBtn.style.cssText = "padding: 0.25rem 0.5rem;";
    
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";
    applyBtn.className = "mq-btn mq-btn-primary mq-btn-compact";
    applyBtn.style.cssText = "padding: 0.25rem 0.5rem;";
    
    dialog.appendChild(label);
    dialog.appendChild(input);
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(applyBtn);
    dialog.appendChild(btnContainer);
    
    // Append to root for proper positioning
    this.root.appendChild(dialog);
    input.focus();
    input.select();
    
    const cleanup = () => {
      dialog.remove();
    };
    
    const apply = () => {
      const value = parseFloat(input.value);
      if (!Number.isFinite(value * Math.PI)) {
        this.toast("Invalid angle value");
        return;
      }
      
      const placement = createRotationPlacement(gateType, [q], id, value * Math.PI);
      
      const valid = validatePlacement(this.circuit, t, placement).ok;
      if (!valid) {
        this.toast("Invalid placement");
        cleanup();
        return;
      }
      
      this.circuit = addGate(this.circuit, t, placement);
      this.renderGrid();
      this.autoRunDebounced();
      cleanup();
    };
    
    cancelBtn.addEventListener("click", cleanup);
    applyBtn.addEventListener("click", apply);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") apply();
      if (e.key === "Escape") cleanup();
    });
  }

  private promptSecondQubit(t: number, gateId: string, firstQ: number, gateType: "CZ" | "SWAP") {
    // Similar to promptControlWire but for CZ and SWAP gates
    const canvas = this.qs<HTMLElement>(".mqcb-canvas");
    canvas.classList.add("selecting-control");
    const cleanup = () => canvas.classList.remove("selecting-control");
    this.toast(`Select second qubit for ${gateType}`);
    const handler = (e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest(".mqcb-cell.mqcb-drop") as HTMLElement | null;
      if (!cell) return;
      const q = parseInt(cell.dataset.q || "-1", 10);
      if (q === firstQ) {
        this.toast("Cannot select the same qubit");
        return;
      }
      // Update the gate with second qubit
      const gate = this.findGateById(gateId);
      if (!gate) return;
      
      let updated: GatePlacement;
      if (gateType === "CZ") {
        // CZ uses controls array for the second qubit
        updated = { ...gate, controls: [q] };
      } else {
        // SWAP uses targets array for both qubits
        updated = { ...gate, targets: [firstQ, q] };
      }
      
      const valid = validatePlacement(this.circuit, t, updated).ok;
      if (!valid) {
        this.toast("Invalid placement");
        cleanup();
        canvas.removeEventListener("click", handler);
        this.circuit = removeGateById(this.circuit, gateId);
        this.renderGrid();
        return;
      }
      // Commit with both qubits
      this.circuit = addGate(this.circuit, t, updated, { overwrite: true });
      cleanup();
      canvas.removeEventListener("click", handler);
      this.renderGrid();
      this.autoRunDebounced();
    };
    canvas.addEventListener("click", handler);
  }

  private onCanvasKeyDown(e: KeyboardEvent) {
    // Handle both Delete and Backspace, check key and code for compatibility
    if (e.key === "Delete" || e.key === "Backspace" || e.code === "Delete" || e.code === "Backspace") {
      if (this.selectedGateId) {
        e.preventDefault(); // Prevent default backspace behavior
        this.circuit = removeGateById(this.circuit, this.selectedGateId);
        this.clearSelection();
        this.clearDragHighlights();
        this.renderGrid();
        this.autoRunDebounced();
      }
    }
  }

  private onChangeQubits(n: number) {
    if (n < MIN_QUBITS || n > MAX_QUBITS) return;
    const confirmReset = this.circuit.columns.some((c) => c.items.some(Boolean)) ? confirm("Changing qubits will clear the circuit. Continue?") : true;
    if (!confirmReset) {
      this.qs<HTMLSelectElement>(".mqcb-qubits").value = String(this.circuit.nQubits);
      return;
    }
    this.circuit = createEmptyCircuit(n, DEFAULT_COLUMNS);
    this.clearSelection();
    this.clearDragHighlights();
    this.renderGrid();
    this.autoRunDebounced();
  }

  private clearSelection() {
    this.selectedGateId = null;
  }

  private findGateById(id: string): GatePlacement | null {
    for (let t = 0; t < this.circuit.columns.length; t++) {
      for (let q = 0; q < this.circuit.nQubits; q++) {
        const gp = this.circuit.columns[t].items[q];
        if (gp && gp.id === id) return gp;
      }
    }
    return null;
  }

  private async runSimulation() {
    try {
      // Run simulation directly in main thread since quantum-circuit needs DOM APIs
      const { buildAndRun } = await import("../../lib/sim/adapter");
      const payload = serializeCircuit(this.circuit);
      const result = await buildAndRun(payload);
      this.onSimulationResult(result);
    } catch (err: any) {
      console.error("Simulation error:", err);
      this.onSimulationResult({
        error: { 
          code: "sim_error", 
          message: err.message || "Simulation failed"
        }
      });
    }
  }

  private onSimulationResult(res: RunResult) {
    const errBox = this.qs<HTMLDivElement>(".mqcb-error");
    const probsList = this.qs<HTMLDivElement>(".mqcb-problist");
    const stateBox = this.qs<HTMLDivElement>(".mqcb-state");
    this.root.querySelectorAll<HTMLElement>(".mqcb-results-empty").forEach((el) => { el.hidden = true; });
    if (res.error) {
      errBox.hidden = false;
      errBox.textContent = res.error.message;
      probsList.innerHTML = "";
      stateBox.innerHTML = "";
      return;
    }
    errBox.hidden = true;
    probsList.innerHTML = this.renderProbList(res.probs || []);
    stateBox.innerHTML = this.renderStatevector(res.statevector);
  }

  private renderProbList(probs: number[]) {
    if (!probs.length) return "";
    const pad = Math.ceil(Math.log2(probs.length));
    const items = probs.map((p, i) => {
      const bit = i.toString(2).padStart(pad, "0");
      const pct = (p * 100).toFixed(2) + "%";
      return `<div class="mqcb-prob"><code>${bit}</code><span class="mqcb-prob-track"><span class="bar" style="--w:${p * 100}%"></span></span><span class="val">${pct}</span></div>`;
    });
    return items.join("");
  }

  private renderStatevector(state?: { re: number[]; im: number[] }) {
    if (!state || !state.re || !state.im || state.re.length !== state.im.length) return "";
    const fmt = (x: number) => {
      const s = x.toFixed(4);
      return /-0\.0000/.test(s) ? "0.0000" : s;
    };
    const parts: string[] = [];
    for (let i = 0; i < state.re.length; i++) {
      const re = fmt(state.re[i]);
      const im = fmt(state.im[i]);
      parts.push(`<div class="mqcb-amp"><code>|${i.toString(2).padStart(Math.ceil(Math.log2(state.re.length)), "0")}\u27e9</code><span>= ${re} + ${im}i</span></div>`);
    }
    return parts.join("");
  }

  private toast(msg: string) {
    const t = this.qs<HTMLDivElement>(".mqcb-toast");
    t.textContent = msg;
    t.hidden = false;
    setTimeout(() => (t.hidden = true), 1600);
  }
}

// Define once
if (!customElements.get(QuantumCircuitElement.tag)) {
  customElements.define(QuantumCircuitElement.tag, QuantumCircuitElement);
}

export { QuantumCircuitElement };
