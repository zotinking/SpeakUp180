(function () {
  const tts = {
    index: 0,
    rate: 0.9,
    sequence: false,
    speaking: false,
    pauseTimer: null,
    contextKey: "",
    generation: 0
  };

  function isSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function currentSentences() {
    try {
      const day = typeof currentDay === "function" ? currentDay() : null;
      return Array.isArray(day?.sentences) ? day.sentences : [];
    } catch {
      return [];
    }
  }

  function currentStep() {
    return state.activeStep ?? state.step ?? "";
  }

  function contextKey() {
    return `${state.profile || ""}:${state.day || 1}`;
  }

  function preferredVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => voice.lang === "en-US") ||
      voices.find((voice) => voice.lang === "en-GB") ||
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
      null
    );
  }

  function stopTts(shouldRender = true) {
    clearTimeout(tts.pauseTimer);
    tts.pauseTimer = null;
    tts.generation += 1;
    tts.sequence = false;
    tts.speaking = false;
    if (isSupported()) window.speechSynthesis.cancel();
    if (shouldRender && typeof render === "function") render();
  }

  function repeatDelay(sentence) {
    const words = sentence.trim().split(/\s+/).length;
    return Math.min(5000, Math.max(2600, 1700 + words * 260));
  }

  function speakAt(index, sequence = false) {
    const sentences = currentSentences();
    if (!isSupported() || !sentences.length) return;

    clearTimeout(tts.pauseTimer);
    window.speechSynthesis.cancel();
    const generation = ++tts.generation;
    tts.index = Math.max(0, Math.min(sentences.length - 1, index));
    tts.sequence = sequence;
    tts.speaking = true;

    const sentence = sentences[tts.index];
    const utterance = new SpeechSynthesisUtterance(sentence.english);
    const voice = preferredVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || "en-US";
    utterance.rate = tts.rate;
    utterance.pitch = 1;

    utterance.onstart = () => {
      if (generation !== tts.generation) return;
      tts.speaking = true;
      if (typeof render === "function") render();
    };

    utterance.onend = () => {
      if (generation !== tts.generation) return;
      tts.speaking = false;
      if (!tts.sequence || tts.index >= sentences.length - 1) {
        tts.sequence = false;
        if (typeof render === "function") render();
        return;
      }

      if (typeof render === "function") render();
      tts.pauseTimer = setTimeout(() => speakAt(tts.index + 1, true), repeatDelay(sentence.english));
    };

    utterance.onerror = () => {
      if (generation !== tts.generation) return;
      tts.speaking = false;
      tts.sequence = false;
      if (typeof render === "function") render();
    };

    window.speechSynthesis.speak(utterance);
    if (typeof render === "function") render();
  }

  function renderTtsPanel() {
    const sentences = currentSentences();
    if (!sentences.length) return "";
    const sentence = sentences[Math.min(tts.index, sentences.length - 1)];
    const status = tts.sequence
      ? tts.speaking
        ? "영어를 들은 뒤, 잠시 멈춘 동안 따라 말하세요."
        : "따라 말할 시간입니다."
      : tts.speaking
        ? "문장을 듣고 있습니다."
        : "한 문장 또는 오늘 10문장을 연속으로 들을 수 있습니다.";

    return `
      <section class="tts-practice" aria-label="Listen and Repeat">
        <div class="tts-heading">
          <div>
            <span>Listen &amp; Repeat</span>
            <strong>듣고 따라 말하기</strong>
          </div>
          <span class="tts-count">${tts.index + 1} / ${sentences.length}</span>
        </div>
        <p class="tts-current">${sentence.english}</p>
        <div class="tts-controls">
          <button class="tts-icon-button" data-tts-prev aria-label="이전 문장" title="이전 문장">‹</button>
          <button class="primary-button" data-tts-speak>${tts.speaking && !tts.sequence ? "재생 중" : "문장 듣기"}</button>
          <button class="tts-icon-button" data-tts-next aria-label="다음 문장" title="다음 문장">›</button>
          <button class="ghost-button" data-tts-sequence>${tts.sequence ? "연속 재생 중" : "10문장 연속"}</button>
          <button class="tts-icon-button" data-tts-stop aria-label="정지" title="정지" ${!tts.speaking && !tts.sequence ? "disabled" : ""}>■</button>
        </div>
        <div class="tts-footer">
          <span>${status}</span>
          <div class="tts-rate" aria-label="재생 속도">
            <button class="${tts.rate === 0.8 ? "active" : ""}" data-tts-rate="0.8">0.8×</button>
            <button class="${tts.rate === 0.9 ? "active" : ""}" data-tts-rate="0.9">0.9×</button>
            <button class="${tts.rate === 1 ? "active" : ""}" data-tts-rate="1">1.0×</button>
          </div>
        </div>
        ${isSupported() ? "" : '<p class="tts-warning">이 브라우저에서는 음성 재생을 지원하지 않습니다.</p>'}
      </section>
    `;
  }

  function enhanceMorningTts() {
    if (typeof state === "undefined") return;

    const nextContext = contextKey();
    const active = state.view === "morning" && currentStep() === "sound";
    if (!active) {
      if (tts.speaking || tts.sequence) stopTts(false);
      return;
    }

    if (tts.contextKey && tts.contextKey !== nextContext) {
      stopTts(false);
      tts.index = 0;
    }
    tts.contextKey = nextContext;

    const sentenceList = document.querySelector(".morning-training-grid .sentence-list, .panel-grid .sentence-list");
    if (!sentenceList || document.querySelector(".tts-practice")) return;
    sentenceList.insertAdjacentHTML("beforebegin", renderTtsPanel());

    document.querySelectorAll(".sentence-row").forEach((row, index) => {
      row.classList.toggle("tts-active-sentence", index === tts.index && (tts.speaking || tts.sequence));
      row.dataset.ttsSentence = String(index);
    });

    document.querySelector("[data-tts-prev]")?.addEventListener("click", () => {
      stopTts(false);
      tts.index = Math.max(0, tts.index - 1);
      render();
    });
    document.querySelector("[data-tts-next]")?.addEventListener("click", () => {
      stopTts(false);
      tts.index = Math.min(currentSentences().length - 1, tts.index + 1);
      render();
    });
    document.querySelector("[data-tts-speak]")?.addEventListener("click", () => speakAt(tts.index, false));
    document.querySelector("[data-tts-sequence]")?.addEventListener("click", () => speakAt(0, true));
    document.querySelector("[data-tts-stop]")?.addEventListener("click", () => stopTts(true));
    document.querySelectorAll("[data-tts-rate]").forEach((button) => {
      button.addEventListener("click", () => {
        tts.rate = Number(button.dataset.ttsRate);
        if (tts.speaking || tts.sequence) speakAt(tts.index, tts.sequence);
        else render();
      });
    });
    document.querySelectorAll("[data-tts-sentence]").forEach((row) => {
      row.addEventListener("dblclick", () => speakAt(Number(row.dataset.ttsSentence), false));
    });
  }

  if (typeof render === "function") {
    const originalRender = render;
    render = function renderWithTts() {
      originalRender();
      enhanceMorningTts();
    };
    render();
  }

  window.addEventListener("pagehide", () => stopTts(false));
})();
