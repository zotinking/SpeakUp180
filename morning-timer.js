(() => {
  function currentReadRemaining() {
    if (typeof state.readRemaining === "number") return state.readRemaining;
    if (typeof state.read === "number") return state.read;
    return null;
  }

  function notifyTimerDone() {
    if ("vibrate" in navigator) navigator.vibrate([180, 80, 180]);
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const tone = (start, frequency) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = frequency;
        oscillator.type = "sine";
        gain.gain.setValueAtTime(0.0001, context.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + 0.32);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(context.currentTime + start);
        oscillator.stop(context.currentTime + start + 0.34);
      };
      tone(0, 880);
      tone(0.38, 1046);
    } catch {}
  }

  function moveMorningTimer() {
    const shell = document.querySelector(".app-shell");
    const main = document.querySelector(".app-shell > .main");
    if (!shell || !main) return;
    shell.classList.toggle("view-morning", state.view === "morning");
    if (state.view !== "morning") return;

    const grid = main.querySelector(".panel-grid");
    const timer = grid?.querySelector(".timer-card");
    if (!grid || !timer || main.querySelector(".morning-layout")) return;

    const layout = document.createElement("section");
    layout.className = "morning-layout";
    const timerWrap = document.createElement("div");
    timerWrap.className = "morning-timer";
    grid.classList.add("morning-training-grid");
    timerWrap.appendChild(timer);
    layout.appendChild(timerWrap);
    layout.appendChild(grid);

    const summary = main.querySelector(".mobile-home-summary");
    if (summary) summary.insertAdjacentElement("afterend", layout);
    else main.insertBefore(layout, grid);
  }

  if (typeof render === "function") {
    const originalRender = render;
    render = function renderWithMorningTimer() {
      originalRender();
      moveMorningTimer();
    };
    render();
  }

  let lastRemaining = currentReadRemaining();
  let alertedKey = "";
  setInterval(() => {
    if (typeof state === "undefined") return;
    const remaining = currentReadRemaining();
    if (remaining == null) return;
    const key = `${state.profile || ""}:${state.day}`;
    if (lastRemaining > 0 && remaining === 0 && alertedKey !== key) {
      alertedKey = key;
      notifyTimerDone();
    }
    if (remaining > 0 && alertedKey === key) alertedKey = "";
    lastRemaining = remaining;
  }, 500);
})();
