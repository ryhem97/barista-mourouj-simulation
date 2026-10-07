const DECISIONS = [
  {
    id: "D1",
    stage: "Stage 1: Pre-initiation",
    title: "Select Project Sponsor",
    hint: "Choose the executive sponsor responsible for high-level project authorization.",
    options: [
      { label: "General Manager (GM)", desc: "Fast decisions; high authority.", capEx: 0, sched: 0, supp: 10, qual: 0, consequence: "GM sponsorship secured high organizational authority." },
      { label: "Head of Development", desc: "Real estate expert; operations gap.", capEx: -5000, sched: -1, supp: 0, qual: -2, consequence: "Saved time on real estate setup, but operational detail was reduced." },
      { label: "Operations Director", desc: "Deep operational focus; strict budget control.", capEx: 0, sched: 1, supp: 5, qual: 5, consequence: "Improved operational alignment, adding 1 week for review." }
    ]
  },
  {
    id: "D2",
    stage: "Stage 2: PM Selection",
    title: "Select Project Manager",
    hint: "Select the individual tasked with daily project planning and execution.",
    options: [
      { label: "Existing Store Manager", desc: "Strong culture fit; stretched bandwidth.", capEx: -10000, sched: 2, supp: 5, qual: -5, consequence: "Saved costs, but limited bandwidth delayed schedule by 2 weeks." },
      { label: "External PM Consultant", desc: "Rigorous methodology; higher cost.", capEx: 15000, sched: -2, supp: -5, qual: 5, consequence: "Accelerated execution by 2 weeks with rigorous quality control." },
      { label: "Regional Area Manager", desc: "Balanced regional knowledge.", capEx: 0, sched: 0, supp: 0, qual: 0, consequence: "Maintained steady progress with no variance." }
    ]
  },
  {
    id: "D3",
    stage: "Stage 3: Delivery Model",
    title: "Select Delivery Model",
    hint: "Determine operational structure for the new branch.",
    options: [
      { label: "Company-Owned Branch", desc: "Maximum brand control; standard budget.", capEx: 0, sched: 0, supp: 0, qual: 0, consequence: "Full company operational control preserved." },
      { label: "Franchised Branch", desc: "Low CapEx outlay; lower control.", capEx: -250000, sched: -4, supp: -10, qual: -10, consequence: "Reduced CapEx drastically, but lowered quality control." },
      { label: "Express Kiosk Model", desc: "Reduced footprint and menu.", capEx: -200000, sched: -2, supp: -5, qual: -5, consequence: "Lower investment and footprint with streamlined operations." }
    ]
  },
  {
    id: "D4",
    stage: "Stage 4: Stakeholders",
    title: "Stakeholder Engagement",
    hint: "Choose the overall stakeholder engagement strategy.",
    options: [
      { label: "Broad Community Engagement", desc: "High buy-in; minor cost and time.", capEx: 5000, sched: 1, supp: 15, qual: 0, consequence: "Boosted stakeholder support score by +15." },
      { label: "Key Executive Focus", desc: "Standard focused approach.", capEx: 0, sched: 0, supp: 0, qual: 0, consequence: "Standard stakeholder alignment maintained." },
      { label: "Minimal Informing Approach", desc: "Saves cost; risks friction.", capEx: -2000, sched: -1, supp: -15, qual: 0, consequence: "Saved cost, but stakeholder support dropped." }
    ]
  },
  {
    id: "D5",
    stage: "Stage 5: Execution",
    title: "Fit-Out Execution Strategy",
    hint: "Choose execution model for construction and setup.",
    options: [
      { label: "Internal Execution", desc: "High brand fidelity; slower pace.", capEx: -10000, sched: 2, supp: 0, qual: 5, consequence: "High quality delivered by internal team (+2 weeks)." },
      { label: "Turnkey Contractor", desc: "Fast delivery; higher cost.", capEx: 20000, sched: -2, supp: 0, qual: -8, consequence: "Fast delivery with minor quality trade-offs." },
      { label: "Hybrid Co-Managed", desc: "Balanced delivery model.", capEx: 0, sched: 0, supp: 0, qual: 2, consequence: "Balanced cost, quality, and time delivery achieved." }
    ]
  }
];

let state = {
  current: 0,
  selectedOpt: null,
  capEx: 650000,
  schedule: 26,
  support: 50,
  quality: 90,
  log: []
};

document.addEventListener("DOMContentLoaded", () => {
  render();

  document.getElementById("voteBtn").addEventListener("click", recordVote);
  document.getElementById("restartBtn").addEventListener("click", restart);

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const target = e.target.dataset.tab;
      document.getElementById("tab-log").classList.toggle("hidden", target !== "log");
      document.getElementById("tab-docs").classList.toggle("hidden", target !== "docs");
    });
  });
});

function render() {
  if (state.current >= DECISIONS.length) {
    showFinal();
    return;
  }

  const d = DECISIONS[state.current];
  document.getElementById("stageLabel").innerText = `STAGE ${state.current + 1}`;
  document.getElementById("stageTitle").innerText = d.stage;
  document.getElementById("stageCount").innerText = `${state.current + 1} / ${DECISIONS.length}`;
  document.getElementById("progressBar").style.width = `${((state.current + 1) / DECISIONS.length) * 100}%`;

  document.getElementById("questionNumber").innerText = d.id;
  document.getElementById("question").innerText = d.title;
  document.getElementById("questionHint").innerText = d.hint;

  const optContainer = document.getElementById("options");
  optContainer.innerHTML = "";
  state.selectedOpt = null;
  document.getElementById("voteBtn").disabled = true;

  d.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.innerHTML = `<strong>${opt.label}</strong><p>${opt.desc}</p>`;
    btn.onclick = () => {
      document.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.selectedOpt = opt;
      document.getElementById("voteBtn").disabled = false;
    };
    optContainer.appendChild(btn);
  });

  updateMetrics();
}

function recordVote() {
  if (!state.selectedOpt) return;

  const opt = state.selectedOpt;
  state.capEx += opt.capEx;
  state.schedule += opt.sched;
  state.support += opt.supp;
  state.quality += opt.qual;

  state.log.push({
    id: DECISIONS[state.current].id,
    choice: opt.label,
    consequence: opt.consequence
  });

  const cons = document.getElementById("consequence");
  cons.innerText = `Consequence: ${opt.consequence}`;
  cons.classList.remove("hidden");

  setTimeout(() => {
    cons.classList.add("hidden");
    state.current++;
    render();
    updateLog();
  }, 1200);
}

function updateMetrics() {
  document.getElementById("budgetMetric").innerText = `${(state.capEx / 1000).toFixed(0)}k TND`;
  document.getElementById("scheduleMetric").innerText = `${state.schedule} Weeks`;
  document.getElementById("supportMetric").innerText = `${state.support} / 100`;
  document.getElementById("qualityMetric").innerText = `${state.quality}%`;
  document.getElementById("decisionMini").innerText = `${state.current} / ${DECISIONS.length}`;

  const budgetWidth = Math.min(100, (state.capEx / 715000) * 100);
  document.getElementById("budgetBar").style.width = `${budgetWidth}%`;
  document.getElementById("scheduleBar").style.width = `${Math.min(100, (state.schedule / 30) * 100)}%`;
  document.getElementById("supportBar").style.width = `${Math.min(100, state.support)}%`;
  document.getElementById("qualityBar").style.width = `${Math.min(100, state.quality)}%`;
}

function updateLog() {
  const logList = document.getElementById("decisionLog");
  logList.innerHTML = "";
  state.log.forEach(item => {
    const div = document.createElement("div");
    div.className = "log-item";
    div.innerHTML = `<strong>${item.id}: ${item.choice}</strong><p>${item.consequence}</p>`;
    logList.appendChild(div);
  });
}

function showFinal() {
  document.getElementById("finalSection").classList.remove("hidden");
  let statusText = "🟢 PROJECT SUCCESSFUL";
  let desc = "The Barista Mourouj branch initiation completed within target constraints.";

  if (state.capEx > 715000 || state.schedule > 30 || state.quality < 90) {
    statusText = "🔴 REWORK REQUIRED";
    desc = "Project exceeded constraints! Capital budget, schedule, or quality fell outside allowed tolerances.";
  }

  document.getElementById("finalTitle").innerText = statusText;
  document.getElementById("finalNarrative").innerText = desc;
}

function restart() {
  state = {
    current: 0,
    selectedOpt: null,
    capEx: 650000,
    schedule: 26,
    support: 50,
    quality: 90,
    log: []
  };
  document.getElementById("finalSection").classList.add("hidden");
  updateLog();
  render();
}
let simulatorKnowledge = [];

fetch('knowledge.json')
  .then(res => res.json())
  .then(data => {
    simulatorKnowledge = data;
    console.log("Loaded Barista Mourouj Specification Base:", simulatorKnowledge);
  });
