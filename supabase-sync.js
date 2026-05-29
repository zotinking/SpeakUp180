(() => {
  const ACTIVE_PROFILE_KEY = "speakup180.activeProfile.v1";
  const SUPABASE_URL = "https://hmnmedoxqhiyzwmvyhlt.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtbm1lZG94cWhpeXp3bXZ5aGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDE3NjQsImV4cCI6MjA5NTU3Nzc2NH0.AmhG2WKv3PDqoft95Oojz32adZAt0nbDa4wEu9aHiWw";
  const PROFILES = ["zotinking", "viridiansky"];

  let cloudSaveTimer = null;
  let suppressCloudSave = false;
  let profileReady = false;

  const originalRender = render;
  const originalSave = save;
  const originalApplyImport = applyImport;
  const originalResetCurriculum = typeof resetCurriculum === "function" ? resetCurriculum : null;
  const lastProfile = localStorage.getItem(ACTIVE_PROFILE_KEY);

  state.profile = PROFILES.includes(lastProfile) ? lastProfile : "";
  state.syncStatus = "계정을 먼저 선택하세요";
  state.syncBusy = false;
  state.lastSyncedAt = "";

  function headers(extra = {}) {
    return {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...extra
    };
  }

  async function request(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: headers(options.headers || {})
    });
    if (!response.ok) throw new Error((await response.text()) || `Supabase ${response.status}`);
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  function progressPayload() {
    return {
      profile_id: state.profile,
      current_day: state.day,
      completed_days: state.progress.completedDays,
      read_done: state.progress.readDone,
      recall_done: state.progress.recallDone,
      checked_sentences: state.progress.checkedSentences
    };
  }

  function renderAccountGate() {
    document.querySelector("#app").innerHTML = `
      <main class="account-gate">
        <section class="account-gate-panel">
          <div class="brand account-gate-brand">
            <div class="brand-mark">180</div>
            <div><h1>SpeakUp 180</h1><p>입으로 깨우는 영어</p></div>
          </div>
          <div class="account-gate-copy">
            <h2>학습 계정을 선택하세요</h2>
            <p>진도는 선택한 계정으로 Supabase에 저장됩니다. 다른 계정으로 잘못 시작하지 않도록 페이지에 들어올 때 먼저 계정을 고르게 했습니다.</p>
          </div>
          <div class="account-choice-grid">
            ${PROFILES.map((profile) => `
              <button class="account-choice" data-initial-profile="${profile}">
                <strong>${profile}</strong>
                <span>${profile === state.profile ? "최근 사용한 계정 · " : ""}${profile}의 학습 진도 불러오기</span>
              </button>
            `).join("")}
          </div>
          <p class="account-gate-note">비밀번호 없는 개인용 선택 방식입니다. 공개 서비스로 키우면 로그인 보호를 추가하는 편이 안전합니다.</p>
        </section>
      </main>
    `;
    document.querySelectorAll("[data-initial-profile]").forEach((button) => {
      button.addEventListener("click", () => selectInitialProfile(button.dataset.initialProfile));
    });
  }

  function updateSyncStatus(text) {
    state.syncStatus = text;
    if (profileReady) injectProfileUi();
  }

  function syncStamp(label) {
    const stamp = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    state.lastSyncedAt = stamp;
    return `${state.profile} ${label} · ${stamp}`;
  }

  async function loadCloudState() {
    if (!profileReady || !state.profile) return;
    state.syncBusy = true;
    updateSyncStatus(`${state.profile} 동기화 불러오는 중`);
    try {
      const [progressRows, curriculumRows] = await Promise.all([
        request(`speakup_progress?profile_id=eq.${encodeURIComponent(state.profile)}&select=*`),
        request(`speakup_curriculums?profile_id=eq.${encodeURIComponent(state.profile)}&select=title,days,updated_at`)
      ]);

      const progress = progressRows?.[0];
      if (progress) {
        suppressCloudSave = true;
        state.day = clamp(progress.current_day || 1, 1, 180);
        state.progress = {
          completedDays: Array.isArray(progress.completed_days) ? progress.completed_days : [],
          readDone: progress.read_done || {},
          recallDone: progress.recall_done || {},
          checkedSentences: progress.checked_sentences || {}
        };
        if (typeof doneRead === "function" && doneRead()) state.step = "recall";
        originalSave();
        suppressCloudSave = false;
      }

      const curriculum = curriculumRows?.[0];
      const normalized = typeof valid === "function" ? valid(curriculum?.days) : null;
      if (normalized) {
        state.curriculum = normalized;
        localStorage.setItem(`speakup180.curriculum.v1.${state.profile}`, JSON.stringify({ days: normalized }));
      }
      originalRender();
      injectProfileUi();
      updateSyncStatus(syncStamp("동기화됨"));
    } catch (error) {
      updateSyncStatus(`동기화 실패: ${error.message.slice(0, 80)}`);
    } finally {
      state.syncBusy = false;
    }
  }

  async function saveCloudState() {
    if (!profileReady || !state.profile) return;
    state.syncBusy = true;
    updateSyncStatus(`${state.profile} 저장 중`);
    try {
      await request("speakup_progress?on_conflict=profile_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(progressPayload())
      });
      updateSyncStatus(syncStamp("저장됨"));
    } catch (error) {
      updateSyncStatus(`저장 실패: ${error.message.slice(0, 80)}`);
    } finally {
      state.syncBusy = false;
    }
  }

  async function saveCloudCurriculum() {
    if (!profileReady || !state.profile) return;
    try {
      await request("speakup_curriculums?on_conflict=profile_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          profile_id: state.profile,
          title: "SpeakUp 180 Custom Curriculum",
          days: state.curriculum
        })
      });
      state.importStatus = `${state.profile} 커리큘럼을 Supabase에 저장했습니다.`;
      originalRender();
      injectProfileUi();
    } catch (error) {
      state.importStatus = `커리큘럼 클라우드 저장 실패: ${error.message.slice(0, 80)}`;
      originalRender();
      injectProfileUi();
    }
  }

  function queueCloudSave() {
    if (suppressCloudSave || !profileReady) return;
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(saveCloudState, 700);
  }

  function injectProfileUi() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    let switcher = sidebar.querySelector(".profile-switcher");
    if (!switcher) {
      switcher = document.createElement("div");
      switcher.className = "profile-switcher";
      const sideCard = sidebar.querySelector(".side-card");
      sidebar.insertBefore(switcher, sideCard || null);
    }

    switcher.innerHTML = `<span>학습 계정</span><div>${PROFILES.map((profile) => `<button class="profile-button ${state.profile === profile ? "active" : ""}" data-profile="${profile}">${profile}</button>`).join("")}</div>`;
    switcher.querySelectorAll("[data-profile]").forEach((button) => {
      button.addEventListener("click", () => switchProfile(button.dataset.profile));
    });

    const card = sidebar.querySelector(".side-card");
    if (card) {
      card.innerHTML = `<strong>Supabase 동기화</strong><p>${state.syncStatus}</p><p>비밀번호 없이 두 프로필을 선택하는 개인용 동기화 방식입니다. 공개 서비스로 키우면 로그인 보호를 추가하는 편이 안전합니다.</p>`;
    }
  }

  function selectInitialProfile(profile) {
    if (!PROFILES.includes(profile)) return;
    profileReady = true;
    state.profile = profile;
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile);
    state.day = 1;
    state.flash = 0;
    state.reveal = false;
    state.status = "";
    state.importStatus = "";
    originalRender();
    injectProfileUi();
    loadCloudState();
  }

  function switchProfile(profile) {
    if (!PROFILES.includes(profile) || profile === state.profile) return;
    clearTimeout(cloudSaveTimer);
    selectInitialProfile(profile);
  }

  render = function patchedRender() {
    if (!profileReady) {
      renderAccountGate();
      return;
    }
    originalRender();
    injectProfileUi();
  };

  save = function patchedSave() {
    originalSave();
    queueCloudSave();
  };

  applyImport = function patchedApplyImport(data) {
    originalApplyImport(data);
    saveCloudCurriculum();
  };

  if (originalResetCurriculum) {
    resetCurriculum = function patchedResetCurriculum() {
      originalResetCurriculum();
      saveCloudCurriculum();
    };
  }

  render();
})();
